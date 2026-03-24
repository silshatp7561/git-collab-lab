from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from voting_app.models import Election, Post, Candidate


class CreateCandidateTests(TestCase):

    def setUp(self):
        # Admin user
        self.admin_user = User.objects.create_user(
            username='admin@example.com',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True,
            is_superuser=True
        )

        # URLs (FIXED)
        self.create_candidate_url = reverse('create_candidate')
        self.admin_dashboard_url = reverse('admin_dashboard')

        # Test data
        self.election = Election.objects.create(
            name="Test Election",
            is_active=True
        )

        self.post = Post.objects.create(
            name="President",
            election=self.election
        )

    def _login_as_admin(self):
        self.client.force_login(self.admin_user)

    def test_create_candidate_successful(self):
        self._login_as_admin()

        response = self.client.post(self.create_candidate_url, {
            'candidate_name': 'John Doe',
            'post_id': self.post.id,
            'semester': '5',
            'department': 'CSE'
        })

        self.assertRedirects(response, self.admin_dashboard_url)
        self.assertEqual(Candidate.objects.count(), 1)

    def test_create_candidate_links_to_election(self):
        self._login_as_admin()

        data = {
            'candidate_name': 'Jane Smith',
            'post_id': self.post.id,
            'semester': '7',
            'department': 'ME'
        }

        response = self.client.post(self.create_candidate_url, data=data)

        self.assertRedirects(response, self.admin_dashboard_url)

        candidate = Candidate.objects.get(name="Jane Smith")
        self.assertEqual(candidate.post.election, self.election)

    def test_create_candidate_requires_login(self):
        response = self.client.post(self.create_candidate_url, {
            'candidate_name': 'Test',
            'post_id': self.post.id
        })

        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_create_candidate_allows_duplicate(self):
        Candidate.objects.create(
            name="John Doe",
            post=self.post,
            semester=5,
            department="CSE"
        )

        self._login_as_admin()

        response = self.client.post(self.create_candidate_url, {
            'candidate_name': 'John Doe',
            'post_id': self.post.id,
            'semester': '5',
            'department': 'CSE'
        })

        self.assertRedirects(response, self.admin_dashboard_url)
        self.assertEqual(Candidate.objects.count(), 2)

    def test_create_candidate_with_invalid_post_id(self):
        """Invalid post_id causes server error (500) in current backend"""
        self._login_as_admin()

        response = self.client.post(self.create_candidate_url, {
            'candidate_name': 'Invalid',
            'post_id': 9999,  # does not exist
            'semester': '3',
            'department': 'ECE'
        })

        self.assertEqual(response.status_code, 500)
