from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from voting_app.models import Election, Post, Candidate


class CreateCandidateTests(TestCase):
    """
    Test Case ID: TC_02
    Objective: Verify that the "Create Candidate" page works correctly.
    """

    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_user(
            username='admin@example.com',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True,
            is_superuser=True
        )

        # Create test data
        self.election = Election.objects.create(
            name="Test Election",
            is_active=True
        )

        self.post = Post.objects.create(
            name="President",
            election=self.election
        )

    def _login_as_admin(self):
        """Use force_login to bypass admin auth issues"""
        self.client.force_login(self.admin_user)

    def test_create_candidate_successful(self):
        """Valid candidate creation"""
        self._login_as_admin()

        response = self.client.post(reverse('create_candidate'), {
            'candidate_name': 'John Doe',
            'post_id': self.post.id,
            'semester': '5',
            'department': 'CSE'
        })

        self.assertRedirects(response, reverse('admin_dashboard'))
        self.assertEqual(Candidate.objects.count(), 1)

        candidate = Candidate.objects.first()
        self.assertEqual(candidate.name, "John Doe")
        self.assertEqual(candidate.post, self.post)
        self.assertEqual(candidate.semester, 5)
        self.assertEqual(candidate.department, "CSE")

    def test_create_candidate_allows_duplicate(self):
        """Backend currently allows duplicate candidates"""
        Candidate.objects.create(
            name="John Doe",
            post=self.post,
            semester=5,
            department="CSE"
        )

        self._login_as_admin()

        response = self.client.post(reverse('create_candidate'), {
            'candidate_name': 'John Doe',
            'post_id': self.post.id,
            'semester': '5',
            'department': 'CSE'
        })

        self.assertRedirects(response, reverse('admin_dashboard'))
        self.assertEqual(Candidate.objects.count(), 2)

    def test_create_candidate_requires_login(self):
        """User must be logged in"""
        response = self.client.post(reverse('create_candidate'), {
            'candidate_name': 'Test',
            'post_id': self.post.id,
        })

        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_create_candidate_links_to_election(self):
        """Candidate should link correctly to election"""
        self._login_as_admin()

        self.client.post(reverse('create_candidate'), {
            'candidate_name': 'Jane Smith',
            'post_id': self.post.id,
            'semester': '7',
            'department': 'ME'
        })

        candidate = Candidate.objects.get(name="Jane Smith")
        self.assertEqual(candidate.post.election.name, "Test Election")        
        Candidate.objects.create(name="Alice Johnson", post=self.post, semester=5, department="CSE")
        
        data = {
            'candidate_name': 'Alice Johnson',
            'post_id': self.post.id,
            'semester': '6',
            'department': 'ME'
        }
        
        response = self.client.post(self.create_candidate_url, data=data)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Candidate.objects.filter(name='Alice Johnson').count(), 2)

    def test_create_candidate_with_invalid_post_id(self):
        """Should return 404 if post_id does not exist."""
        self.client.login(username='admin', password='adminpass123')
        
        data = {
            'candidate_name': 'Invalid Post Candidate',
            'post_id': 9999,
            'semester': '1',
            'department': 'CSE'
        }
        
        response = self.client.post(self.create_candidate_url, data=data)
        self.assertEqual(response.status_code, 404)   # ← Changed to check status code
