from django.test import TestCase
from django.urls import reverse
from voting_app.models import Election, Post, Candidate


class CreateCandidateTestCase(TestCase):
    """
    Test Case ID: TC_02
    Objective: Verify that an admin can successfully create a new candidate.
    """

    def setUp(self):
        # Create necessary related objects
        self.election = Election.objects.create(name="General Election", is_active=True)
        self.post = Post.objects.create(name="President", election=self.election)
        
        # Create a staff user for admin access (staff_member_required)
        from django.contrib.auth.models import User
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True,
            is_superuser=True
        )

        self.create_candidate_url = reverse('create_candidate')

    def test_create_candidate_page_loads_for_admin(self):
        """TC_02 Step 1-2: Admin can access the Create Candidate page."""
        self.client.login(username='admin', password='adminpass123')
        
        response = self.client.get(self.create_candidate_url)
        
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'create_candidate.html')
        # Check that posts are passed to the template
        self.assertIn('posts', response.context)
        self.assertQuerysetEqual(response.context['posts'], Post.objects.all(), ordered=False)

    def test_successful_candidate_creation(self):
        """
        TC_02 Main Test: Admin can create a candidate with valid details.
        
        Steps:
        1. Login as admin
        2. Navigate to Create Candidate page
        3. Enter candidate name, select post, semester, department
        4. Submit the form
        
        Expected Result: Candidate is created and admin is redirected to dashboard.
        """
        self.client.login(username='admin', password='adminpass123')
        
        valid_data = {
            'candidate_name': 'Alice Johnson',
            'post_id': self.post.id,
            'semester': '5',
            'department': 'CSE'
        }
        
        response = self.client.post(self.create_candidate_url, data=valid_data)
        
        # Should redirect to admin dashboard after successful creation
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('admin_dashboard'))
        
        # Verify candidate was created in database
        candidate = Candidate.objects.filter(name='Alice Johnson').first()
        self.assertIsNotNone(candidate)
        self.assertEqual(candidate.post, self.post)
        self.assertEqual(candidate.semester, 5)
        self.assertEqual(candidate.department, 'CSE')

    def test_create_candidate_without_login(self):
        """Unauthenticated user should be redirected to admin login."""
        response = self.client.get(self.create_candidate_url)
        self.assertEqual(response.status_code, 302)
        # staff_member_required redirects to admin:login by default
        self.assertRedirects(response, '/admin/login/?next=' + self.create_candidate_url)

    def test_create_candidate_missing_required_fields(self):
        """Test that submission with missing fields does not create a candidate."""
        self.client.login(username='admin', password='adminpass123')
        
        # Missing candidate_name
        data1 = {
            'post_id': self.post.id,
            'semester': '5',
            'department': 'CSE'
        }
        response = self.client.post(self.create_candidate_url, data=data1)
        self.assertEqual(response.status_code, 302)  # still redirects (no validation in view)
        self.assertEqual(Candidate.objects.count(), 0)  # No candidate created

        # Missing post_id
        data2 = {
            'candidate_name': 'Bob Smith',
            'semester': '3',
            'department': 'ECE'
        }
        response = self.client.post(self.create_candidate_url, data=data2)
        self.assertEqual(Candidate.objects.count(), 0)

    def test_create_candidate_duplicate_name_for_same_post(self):
        """Allow duplicate names for now (view does not prevent it)."""
        self.client.login(username='admin', password='adminpass123')
        
        Candidate.objects.create(name="Alice Johnson", post=self.post, semester=5, department="CSE")
        
        data = {
            'candidate_name': 'Alice Johnson',  # duplicate
            'post_id': self.post.id,
            'semester': '6',
            'department': 'ME'
        }
        
        response = self.client.post(self.create_candidate_url, data=data)
        self.assertEqual(response.status_code, 302)
        # Currently 2 candidates with same name are allowed (as per current view logic)
        self.assertEqual(Candidate.objects.filter(name='Alice Johnson').count(), 2)

    def test_create_candidate_with_invalid_post_id(self):
        """Should raise 404 if post_id does not exist (as per get_object_or_404)."""
        self.client.login(username='admin', password='adminpass123')
        
        data = {
            'candidate_name': 'Invalid Post Candidate',
            'post_id': 9999,  # non-existent
            'semester': '1',
            'department': 'CSE'
        }
        
        from django.http import Http404
        with self.assertRaises(Http404):
            self.client.post(self.create_candidate_url, data=data)
