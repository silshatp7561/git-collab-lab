import hashlib
import secrets
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import logout
from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.db.models import Count, Sum
from django.views.decorators.http import require_POST

from .models import Block, Candidate, Election, Post, PublishedResult, Voter
from .smart_contract import clear_published_results, publish_results_with_contract


def generate_wallet():
    private_key = secrets.token_hex(32)
    wallet_hash = hashlib.sha256(private_key.encode()).hexdigest()
    wallet_address = "0x" + wallet_hash[:40]
    return wallet_address

def register_voter(request):
    request.session['show_navbar'] = True

    if request.method == "POST":
        email = (request.POST.get("email") or "").strip().lower()
        password = request.POST.get("password") or ""

        if not email or not password:
            return render(request, "register.html", {
                "registered": False,
                "error": "Email and password are required.",
            })

        if Voter.objects.filter(email__iexact=email).exists():
            return render(request, "register.html", {
                "registered": False,
                "error": "This email is already registered. Please login.",
                "email": email,
            })

        wallet = generate_wallet()
        # Save voter in database
        Voter.objects.create(
            email=email,
            password_hash=make_password(password),
            wallet_address=wallet
        )

        # Show the register page with registered flag so template shows Login
        return render(request, "register.html", {
            "registered": True,
            "wallet": wallet,
            "email": email,
        })

    # Ensure template gets a registered flag on GET (False) so the register
    # button is shown when appropriate.
    return render(request, "register.html", {"registered": False})




@staff_member_required(login_url='admin:login')
def admin_dashboard(request):
    request.session['show_navbar'] = True

    voters = Voter.objects.all()
    elections = Election.objects.all()
    return render(request, "admin_dashboard.html", {
        "voters": voters,
        "elections": elections
    })


@staff_member_required(login_url='admin:login')
def admin_logout(request):
    logout(request)
    request.session.pop('show_navbar', None)
    return redirect('home')

@staff_member_required(login_url='admin:login')
@require_POST
def approve_voter(request, voter_id):
    voter = get_object_or_404(Voter, id=voter_id)
    voter.approved = True
    voter.save()
    return redirect('admin_dashboard')

@staff_member_required(login_url='admin:login')
@require_POST
def remove_voter(request, voter_id):
    voter = get_object_or_404(Voter, id=voter_id)
    voter.delete()
    return redirect('admin_dashboard')


@staff_member_required(login_url='admin:login')
@require_POST
def toggle_election(request, election_id):
    election = get_object_or_404(Election, id=election_id)
    election.is_active = not election.is_active
    election.save(update_fields=['is_active'])

    # Reopen => clear published snapshot. Deactivate => auto count and publish.
    if election.is_active:
        clear_published_results(election)
    else:
        publish_results_with_contract(election)
    return redirect('admin_dashboard')


@staff_member_required(login_url='admin:login')
@require_POST
def mark_election_completed(request, election_id):
    election = get_object_or_404(Election, id=election_id)
    election.is_completed = True
    election.save(update_fields=['is_completed'])
    return redirect('admin_dashboard')


def _count_votes_from_blockchain(selected_election):
    published_rows = PublishedResult.objects.filter(election=selected_election).select_related(
        "candidate", "candidate__post"
    )
    if published_rows.exists():
        results = []
        for row in published_rows:
            results.append({
                "candidate_id": row.candidate_id,
                "candidate__name": row.candidate.name,
                "candidate__post__name": row.candidate.post.name,
                "candidate__department": row.candidate.department,
                "candidate__semester": row.candidate.semester,
                "total_votes": row.total_votes,
            })
        results.sort(
            key=lambda r: (
                r["candidate__post__name"],
                -r["total_votes"],
                r["candidate__name"],
                r["candidate_id"],
            )
        )
    else:
        vote_rows = Block.objects.filter(candidate__post__election=selected_election)
        results = vote_rows.values(
            'candidate_id',
            'candidate__name',
            'candidate__post__name',
            'candidate__department',
            'candidate__semester',
        ).annotate(total_votes=Count('id')).order_by(
            'candidate__post__name', '-total_votes', 'candidate__name', 'candidate_id'
        )

    ranked_results = []
    current_post = None
    last_votes = None
    current_rank = 0

    for row in results:
        post_name = row['candidate__post__name']
        votes = row['total_votes']

        if post_name != current_post:
            current_post = post_name
            last_votes = None
            current_rank = 0

        if votes != last_votes:
            current_rank += 1
            last_votes = votes

        row['rank'] = current_rank
        ranked_results.append(row)

    total_votes = sum(row['total_votes'] for row in ranked_results)
    candidate_count = len(ranked_results)
    distribution = sorted(ranked_results, key=lambda row: (-row['total_votes'], row['candidate__name']))
    leading_candidate = distribution[0] if distribution else None

    for row in ranked_results:
        row['percentage'] = round((row['total_votes'] / total_votes) * 100) if total_votes else 0
    for row in distribution:
        row['percentage'] = round((row['total_votes'] / total_votes) * 100) if total_votes else 0

    leaders_by_post = []
    post_groups = {}
    for row in ranked_results:
        post_name = row['candidate__post__name']
        post_groups.setdefault(post_name, []).append(row)

    for post_name, rows in post_groups.items():
        top_votes = rows[0]['total_votes'] if rows else 0
        leaders = [r for r in rows if r['total_votes'] == top_votes]
        leaders_by_post.append({
            'post_name': post_name,
            'leaders': leaders,
            'top_votes': top_votes,
        })

    return ranked_results, distribution, total_votes, candidate_count, leading_candidate, leaders_by_post


def home(request):
    return render(request, "home.html")



@staff_member_required(login_url='admin:login')
def create_election(request):
    if request.method == "POST":
        print("FORM SUBMITTED")
        name = request.POST.get("election_name")
        print("Election Name:", name)

        Election.objects.create(name=name)
        print("Saved to DB")

        return redirect('admin_dashboard')

    return render(request, 'create_election.html')


@staff_member_required(login_url='admin:login')
def create_post(request):
    elections = Election.objects.all()

    if request.method == "POST":
        post_name = request.POST.get("post_name")
        election_id = request.POST.get("election_id")

        election = Election.objects.get(id=election_id)

        Post.objects.create(
            name=post_name,
            election=election
        )

        return redirect('admin_dashboard')

    return render(request, 'create_post.html', {
        'elections': elections
    }) 





@staff_member_required(login_url='admin:login')
def create_candidate(request):
    posts = Post.objects.all()

    if request.method == "POST":
        candidate_name = request.POST.get("candidate_name")
        post_id = request.POST.get("post_id")

        post = Post.objects.get(id=post_id)

        # New fields: semester and department
        semester = request.POST.get("semester")
        department = request.POST.get("department")

        Candidate.objects.create(
            name=candidate_name,
            post=post,
            semester=(int(semester) if semester else None),
            department=(department or "")
        )

        return redirect('admin_dashboard')

    return render(request, 'create_candidate.html', {'posts': posts})  

def voter_login(request):
    request.session['show_navbar'] = True

    if request.method == "POST":
        email = (request.POST.get("email") or "").strip().lower()
        password = request.POST.get("password") or ""
        wallet = (request.POST.get("wallet") or "").strip()

        voter = Voter.objects.filter(email__iexact=email, wallet_address=wallet).first()
        if not voter:
            return render(request, 'voter_login.html', {
                'error': "Invalid credentials. Check email, password, and wallet address."
            })

        if not check_password(password, voter.password_hash):
            return render(request, 'voter_login.html', {
                'error': "Invalid credentials. Check email, password, and wallet address."
            })

        if voter.approved:
            request.session['wallet'] = wallet
            return redirect('voter_dashboard')

        return render(request, 'voter_login.html', {
            'error': "Your account is not approved by admin."
        })

    return render(request, 'voter_login.html')


def voter_logout(request):
    # Remove the wallet from session to log the voter out
    request.session.pop('wallet', None)
    return redirect('home')


def voter_dashboard(request):
    if not request.session.get("wallet"):
        return redirect("voter_login")

    voter = Voter.objects.filter(wallet_address=request.session["wallet"]).first()
    if not voter:
        request.session.pop('wallet', None)
        return redirect("voter_login")
    active_elections = Election.objects.filter(is_active=True).order_by("name")

    return render(request, "voter_dashboard.html", {
        "voter": voter,
        "active_elections": active_elections,
    })

@require_POST
def cast_vote(request, candidate_id):
    if 'wallet' not in request.session:
        return redirect('voter_login')

    wallet = request.session['wallet']

    candidate = get_object_or_404(Candidate, id=candidate_id)

    voter = Voter.objects.filter(wallet_address=wallet, approved=True).first()
    if not voter:
        request.session.pop('wallet', None)
        return redirect('voter_login')

    # Voting remains controlled only by is_active.
    if not candidate.post.election.is_active:
        return render(request, 'vote_error.html', {
            'error': "This election is not active."
        })

    # Prevent double voting for the same post (allow voting across different posts)
    with transaction.atomic():
        # Serialize vote writes per wallet to avoid duplicate votes from concurrent requests.
        Voter.objects.select_for_update().filter(id=voter.id).first()

        if Block.objects.filter(voter_wallet=wallet, candidate__post=candidate.post).exists():
            return render(request, 'vote_error.html', {
                'error': "You have already voted for this post!"
            })

        # Get last block
        last_block = Block.objects.select_for_update().order_by('-id').first()
        previous_hash = last_block.hash if last_block else "0"

        # Simulate gas used for this transaction
        gas_sim = 21000 + (secrets.randbelow(4000))

        block = Block(
            voter_wallet=wallet,
            candidate=candidate,
            previous_hash=previous_hash,
            gas_used=gas_sim
        )

        block.save()
    # After saving, check if voter has now voted for all posts in this election
    election = candidate.post.election
    posts = Post.objects.filter(election=election)

    all_voted = True
    for post in posts:
        if not Block.objects.filter(voter_wallet=wallet, candidate__post=post).exists():
            all_voted = False
            break

    return render(request, 'vote_success.html', {
        'candidate': candidate,
        'election': election,
        'all_voted': all_voted,
    })

def results_view(request):
    elections = Election.objects.order_by('-is_completed', '-is_active', 'name')
    selected_election = None
    selected_election_id = request.GET.get('election')

    if selected_election_id:
        selected_election = Election.objects.filter(id=selected_election_id).first()

    if not selected_election:
        selected_election = elections.filter(is_active=True).first() or elections.first()

    can_view_results = bool(selected_election and selected_election.is_completed)

    ranked_results = []
    distribution = []
    total_votes = 0
    candidate_count = 0
    leading_candidate = None
    results_block_reason = ""

    if selected_election and not selected_election.is_completed:
        results_block_reason = "Results will be available after the election is completed by admin."

    leaders_by_post = []
    if can_view_results:
        ranked_results, distribution, total_votes, candidate_count, leading_candidate, leaders_by_post = _count_votes_from_blockchain(selected_election)

    return render(request, 'results.html', {
        'can_view_results': can_view_results,
        'results_block_reason': results_block_reason,
        'results': ranked_results,
        'distribution': distribution,
        'total_votes': total_votes,
        'candidate_count': candidate_count,
        'leading_candidate': leading_candidate,
        'leaders_by_post': leaders_by_post,
        'elections': elections,
        'selected_election': selected_election,
    })    


@staff_member_required(login_url='admin:login')
def blockchain_view(request):
    request.session['show_navbar'] = True
    active_elections = Election.objects.filter(is_active=True).count()
    transactions = Block.objects.order_by('-id')

    total_transactions = transactions.count()
    vote_transactions = transactions.count()
    latest_block = transactions.first()
    total_gas = transactions.aggregate(total=Sum('gas_used'))['total'] or 0

    return render(request, 'blockchain.html', {
        'active_elections': active_elections,
        'transactions': transactions,
        'total_gas': total_gas,
        'total_transactions': total_transactions,
        'vote_transactions': vote_transactions,
        'latest_block_number': latest_block.id if latest_block else 0,
    })

def view_election(request, election_id):
    election = get_object_or_404(Election, id=election_id)
    posts = Post.objects.filter(election=election)

    # all candidates for these posts (template may also use post.candidate_set)
    candidates = Candidate.objects.filter(post__in=posts)

    wallet = request.session.get('wallet')

    # For each post determine whether the current voter already voted for that post
    voted_posts = {}
    if wallet:
        for post in posts:
            voted_posts[post.id] = Block.objects.filter(voter_wallet=wallet, candidate__post=post).exists()
    else:
        for post in posts:
            voted_posts[post.id] = False

    # list of post ids the voter has voted for (template-friendly)
    voted_post_ids = [pid for pid, val in voted_posts.items() if val]

    # Also compute set of candidate ids the voter has voted for
    voted_candidate_ids = set(Block.objects.filter(voter_wallet=wallet).values_list('candidate_id', flat=True)) if wallet else set()

    return render(request, "view_election.html", {
        "election": election,
        "posts": posts,
        "candidates": candidates,
        "voted_posts": voted_posts,
        "voted_post_ids": voted_post_ids,
        "wallet": wallet,
        "voted_candidate_ids": voted_candidate_ids,
    })    
