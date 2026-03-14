from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from voting_app.models import Voter, Election, Post, Candidate, Block

class VotingSystemAdditionalTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_superuser(username='admin', password='password123', email='admin@example.com')
        
    def test_voter_approval(self):
        """
        TC_VOTER_APPROVAL: Admin Approves Voter
        """
        # Create unapproved voter
        voter = Voter.objects.create(wallet_address="0xabc123", approved=False)
        
        # Login admin
        self.client.force_login(self.admin_user)
        
        # Approve voter
        response = self.client.post(reverse('approve_voter', args=[voter.id]))
        
        # Check redirect to admin dashboard
        self.assertRedirects(response, reverse('admin_dashboard'))
        
        # Verify approval in DB
        voter.refresh_from_db()
        self.assertTrue(voter.approved)

    def test_cast_vote(self):
        """
        TC_CAST_VOTE: Voter Casts a Valid Vote
        """
        # Data setup
        voter = Voter.objects.create(wallet_address="0xapproved_voter", approved=True)
        election = Election.objects.create(name="Student Council", is_active=True)
        post = Post.objects.create(name="President", election=election)
        candidate = Candidate.objects.create(name="Alice", post=post)
        
        # Simulate voter session
        session = self.client.session
        session['wallet'] = voter.wallet_address
        session.save()
        
        # Cast vote
        response = self.client.post(reverse('cast_vote', args=[candidate.id]))
        
        # Verify success template
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "vote_success.html")
        
        # Verify block creation
        self.assertEqual(Block.objects.count(), 1)
        block = Block.objects.first()
        self.assertEqual(block.voter_wallet, voter.wallet_address)
        self.assertEqual(block.candidate, candidate)

    def test_prevent_double_voting(self):
        """
        TC_PREVENT_DOUBLE_VOTE: Voter Cannot Vote Twice for the Same Post
        """
        # Data setup
        voter = Voter.objects.create(wallet_address="0xone_vote_voter", approved=True)
        election = Election.objects.create(name="Annual Election", is_active=True)
        post = Post.objects.create(name="Chairman", election=election)
        candidate1 = Candidate.objects.create(name="Bob", post=post)
        candidate2 = Candidate.objects.create(name="Charlie", post=post)
        
        # Simulate voter session
        session = self.client.session
        session['wallet'] = voter.wallet_address
        session.save()
        
        # First vote
        self.client.post(reverse('cast_vote', args=[candidate1.id]))
        self.assertEqual(Block.objects.count(), 1)
        
        # Second vote attempt for same post (different candidate)
        response = self.client.post(reverse('cast_vote', args=[candidate2.id]))
        
        # Should show error message
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "You have already voted for this post!")
        
        # Block count should still be 1
        self.assertEqual(Block.objects.count(), 1)

    def test_admin_create_election(self):
        """
        TC_ADMIN_CREATE_ELECTION: Admin Creates an Election
        """
        self.client.force_login(self.admin_user)
        
        election_name = "New Test Election"
        response = self.client.post(reverse('create_election'), {'election_name': election_name})
        
        # Redirect to dashboard
        self.assertRedirects(response, reverse('admin_dashboard'))
        
        # Verify in DB
        self.assertTrue(Election.objects.filter(name=election_name).exists())
