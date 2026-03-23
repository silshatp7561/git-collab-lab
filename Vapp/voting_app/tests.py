from django.contrib.auth.hashers import make_password
from django.test import TestCase
from django.urls import reverse

from .models import Block, Candidate, Election, Post, PublishedResult, Voter


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


from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from .models import Election


class AdminTests(TestCase):
    def setUp(self):
        self.staff_user = User.objects.create_user(
            username="admin@test.com",
            email="admin@test.com",
            password="adminpass",
            is_staff=True
        )
        self.client.force_login(self.staff_user)

    def test_create_election_get(self):
        """Test GET request to create_election renders template."""
        response = self.client.get(reverse("create_election"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "create_election.html")

    def test_create_election_post_valid(self):
        """Test valid POST creates Election and redirects."""
        initial_count = Election.objects.count()
        response = self.client.post(reverse("create_election"), {
            "election_name": "Test Election 2024"
        })
        self.assertRedirects(response, reverse("admin_dashboard"))
        self.assertEqual(Election.objects.count(), initial_count + 1)
        election = Election.objects.get(name="Test Election 2024")
        self.assertFalse(election.is_active)  # Default is False per model

    def test_create_election_post_invalid(self):
        """Test invalid POST (missing name) raises IntegrityError, no Election created."""
        initial_count = Election.objects.count()
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.client.post(reverse("create_election"), {})
        self.assertEqual(Election.objects.count(), initial_count)

    def test_create_post_get(self):
        """Test GET request to create_post renders with elections."""
        # Create an election for context
        Election.objects.create(name="Existing Election")
        response = self.client.get(reverse("create_post"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "create_post.html")
        self.assertIn("elections", response.context)

    def test_create_post_post_valid(self):
        """Test valid POST creates Post for existing Election."""
        election = Election.objects.create(name="Test Election")
        initial_count = Post.objects.count()
        response = self.client.post(reverse("create_post"), {
            "post_name": "President",
            "election_id": election.id
        })
        self.assertRedirects(response, reverse("admin_dashboard"))
        self.assertEqual(Post.objects.count(), initial_count + 1)
        post = Post.objects.get(name="President")
        self.assertEqual(post.election, election)

    def test_create_post_post_invalid(self):
        """Test invalid POST (missing fields) does not create."""
        initial_count = Post.objects.count()
        # View crashes on get(election_id=None), test that no Post created despite error
        with self.assertRaises((Election.DoesNotExist, IntegrityError)):
            self.client.post(reverse("create_post"), {})
        self.assertEqual(Post.objects.count(), initial_count)

