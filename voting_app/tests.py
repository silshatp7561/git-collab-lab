from django.contrib.auth.hashers import make_password
from django.test import TestCase
from django.urls import reverse

from voting_app.models import Block, Candidate, Election, Post, PublishedResult, Voter
from django.contrib.auth.hashers import check_password

class VotingTests(TestCase):
    def setUp(self):
        self.election = Election.objects.create(name="General Election", is_active=True)
        self.post_1 = Post.objects.create(name="President", election=self.election)
        self.post_2 = Post.objects.create(name="Secretary", election=self.election)
        self.candidate_1 = Candidate.objects.create(name="Alice", post=self.post_1)
        self.candidate_2 = Candidate.objects.create(name="Bob", post=self.post_2)
        self.voter = Voter.objects.create(
            email="voter@example.com",
            password_hash=make_password("pass123"),
            wallet_address="0xwallet1",
            approved=True,
        )

    def _set_wallet_session(self, wallet="0xwallet1"):
        session = self.client.session
        session["wallet"] = wallet
        session.save()

    def test_cast_vote_requires_logged_in_wallet(self):
        response = self.client.post(reverse("cast_vote", args=[self.candidate_1.id]))
        self.assertRedirects(response, reverse("voter_login"))
        self.assertEqual(Block.objects.count(), 0)

    def test_cast_vote_creates_block_with_previous_hash(self):
        self._set_wallet_session()

        first_vote = self.client.post(reverse("cast_vote", args=[self.candidate_1.id]))
        self.assertEqual(first_vote.status_code, 200)
        self.assertEqual(Block.objects.count(), 1)

        first_block = Block.objects.get(candidate=self.candidate_1)
        self.assertEqual(first_block.previous_hash, "0")

        second_vote = self.client.post(reverse("cast_vote", args=[self.candidate_2.id]))
        self.assertEqual(second_vote.status_code, 200)
        self.assertEqual(Block.objects.count(), 2)

        second_block = Block.objects.get(candidate=self.candidate_2)
        self.assertEqual(second_block.previous_hash, first_block.hash)

    def test_all_voted_flag_false_then_true(self):
        self._set_wallet_session()

        first_vote = self.client.post(reverse("cast_vote", args=[self.candidate_1.id]))
        self.assertEqual(first_vote.context["all_voted"], False)

        second_vote = self.client.post(reverse("cast_vote", args=[self.candidate_2.id]))
        self.assertEqual(second_vote.context["all_voted"], True)




class ResultsTests(TestCase):
    def setUp(self):
        self.election = Election.objects.create(name="CS Election", is_active=True)
        self.post = Post.objects.create(name="President", election=self.election)
        self.candidate_a = Candidate.objects.create(
            name="Alice", post=self.post, department="CSE", semester=5
        )
        self.candidate_b = Candidate.objects.create(
            name="Bob", post=self.post, department="CSE", semester=5
        )

    def test_results_hidden_while_election_active(self):
        response = self.client.get(reverse("results"), {"election": self.election.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["can_view_results"], False)
        self.assertIn("active", response.context["results_block_reason"].lower())

    def test_results_hidden_when_unpublished_and_inactive(self):
        self.election.is_active = False
        self.election.results_published = False
        self.election.save(update_fields=["is_active", "results_published"])

        response = self.client.get(reverse("results"), {"election": self.election.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["can_view_results"], False)
        self.assertIn("not published", response.context["results_block_reason"].lower())

    def test_results_use_published_snapshot_when_available(self):
        self.election.is_active = False
        self.election.results_published = True
        self.election.save(update_fields=["is_active", "results_published"])

        PublishedResult.objects.create(
            election=self.election, candidate=self.candidate_a, total_votes=7
        )
        PublishedResult.objects.create(
            election=self.election, candidate=self.candidate_b, total_votes=3
        )

        response = self.client.get(reverse("results"), {"election": self.election.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["can_view_results"], True)
        self.assertEqual(response.context["total_votes"], 10)

        result_names = [row["candidate__name"] for row in response.context["results"]]
        self.assertEqual(result_names, ["Alice", "Bob"])

        leader = response.context["leading_candidate"]
        self.assertEqual(leader["candidate__name"], "Alice")


class RegistrationTests(TestCase):
    """
    Test Case ID: TC_REG_01
    Objective: Verify that a new user can register successfully in the system.
    """
    def setUp(self):
        Voter.objects.all().delete()  # Ensure clean state

    def test_register_successful(self):
        # Steps:
        # 1. (Open website) - Django test client simulates
        # 2. (Navigate to Registration) - reverse('register')
        # 3. Enter valid details
        # 4. Click Register
        response = self.client.post(reverse('register'), {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        })

        # Expected: New user account created, confirmation shown
        self.assertEqual(Voter.objects.count(), 1)
        voter = Voter.objects.first()
        self.assertEqual(voter.email, 'testuser@example.com')
        self.assertTrue(check_password('testpass123', voter.password_hash))
        self.assertTrue(voter.wallet_address.startswith('0x'))
        self.assertIn('registered', response.context)
        self.assertTrue(response.context['registered'])


class VoterLogoutTests(TestCase):
    """
    Test Case ID: TC_LOGOUT_01
    Objective: Verify that a logged-in user can log out of the system.
    """
    def setUp(self):
        Voter.objects.all().delete()
        self.voter = Voter.objects.create(
            email='logoutuser@example.com',
            password_hash=make_password('pass'),
            wallet_address='0xtestwallet',
            approved=True
        )
        # Simulate logged-in session
        session = self.client.session
        session['wallet'] = self.voter.wallet_address
        session.save()

    def test_logout_clears_session_redirects_home(self):
        # Steps:
        # 1. (Logged in) - session set in setUp
        # 2. Click Logout
        response = self.client.get(reverse('voter_logout'))

        # Expected: Logged out (no wallet in session), redirect to home/login
        self.assertRedirects(response, reverse('home'))
