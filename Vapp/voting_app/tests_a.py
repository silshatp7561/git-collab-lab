from django.test import TestCase
from voting_app.models import Election, Post, Candidate


class SimpleCandidateTest(TestCase):
    """
    Test Case ID: 
    Objective: Verify candidate creation works correctly.
    """

    def setUp(self):
        # Create election and post
        self.election = Election.objects.create(
            name="Test Election",
            is_active=True
        )
        self.post = Post.objects.create(
            name="President",
            election=self.election
        )

    def test_candidate_creation(self):
        # Step: Create candidate
        candidate = Candidate.objects.create(
            name="John Doe",
            post=self.post
        )

        # Expected Results
        self.assertEqual(Candidate.objects.count(), 1)
        self.assertEqual(candidate.name, "John Doe")
        self.assertEqual(candidate.post.name, "President")
