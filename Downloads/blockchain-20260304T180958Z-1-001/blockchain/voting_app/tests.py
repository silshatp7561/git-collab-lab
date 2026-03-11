from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from .models import Voter


class VoterRegistrationTestCase(TestCase):
    """
    Test Case ID: TC_REG_01
    Objective: Verify that a new user can register successfully in the system.
    """
    
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')
    
    def test_successful_registration(self):
        """
        Test that a new user can register successfully with valid details.
        
        Steps:
        1. Open the Online Voting System website.
        2. Navigate to the Registration page.
        3. Enter valid user details such as name, email, and password.
        4. Click the "Register" button.
        
        Expected Result:
        The system should successfully create a new user account and display 
        a confirmation message.
        """
        # Step 1 & 2: Navigate to registration page
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, 200)
        
        # Step 3: Enter valid user details
        valid_data = {
            'email': 'testvoter@example.com',
            'password': 'securePassword123'
        }
        
        # Step 4: Submit registration form
        response = self.client.post(self.register_url, data=valid_data)
        
        # Expected Result: Registration successful
        self.assertEqual(response.status_code, 200)
        
        # Verify the user was created in the database
        voter = Voter.objects.filter(email='testvoter@example.com').first()
        self.assertIsNotNone(voter, "Voter should be created in the database")
        
        # Verify wallet address was generated
        self.assertIsNotNone(voter.wallet_address, "Wallet address should be generated")
        
        # Verify password is hashed (not stored in plain text)
        self.assertNotEqual(voter.password_hash, 'securePassword123', 
                           "Password should be hashed, not stored in plain text")
        
        # Verify the response indicates successful registration
        self.assertIn(b'registered', response.content.lower() 
                     if isinstance(response.content, bytes) else response.content.lower())
    
    def test_registration_duplicate_email(self):
        """
        Test that duplicate email registration is rejected.
        """
        # Create first voter
        Voter.objects.create(
            email='existing@example.com',
            password_hash='hashed_password',
            wallet_address='0x1234567890abcdef'
        )
        
        # Try to register with duplicate email
        response = self.client.post(self.register_url, {
            'email': 'existing@example.com',
            'password': 'newpassword123'
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'already registered', response.content.lower() 
                     if isinstance(response.content, bytes) else response.content.lower())
    
    def test_registration_missing_fields(self):
        """
        Test that registration fails when required fields are missing.
        """
        # Test with missing email
        response = self.client.post(self.register_url, {
            'password': 'somepassword'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'required', response.content.lower() 
                     if isinstance(response.content, bytes) else response.content.lower())
        
        # Test with missing password
        response = self.client.post(self.register_url, {
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'required', response.content.lower() 
                     if isinstance(response.content, bytes) else response.content.lower())


class VoterLogoutTestCase(TestCase):
    """
    Test Case ID: TC_LOGOUT_01
    Objective: Verify that a logged-in user can log out of the system.
    """
    
    def setUp(self):
        self.client = Client()
        self.voter_login_url = reverse('voter_login')
        self.voter_logout_url = reverse('voter_logout')
        self.home_url = reverse('home')
        
        # Create and approve a test voter with properly hashed password
        self.test_wallet = '0xabcdef1234567890abcdef1234567890ab'
        self.test_password = 'testpassword123'
        self.voter = Voter.objects.create(
            email='logouttest@example.com',
            password_hash=make_password(self.test_password),
            wallet_address=self.test_wallet,
            approved=True
        )
    
    def test_successful_logout(self):
        """
        Test that a logged-in user can successfully log out.
        
        Steps:
        1. Log in to the Online Voting System using valid credentials.
        2. Click the "Logout" button.
        
        Expected Result:
        The system should log the user out and redirect them to the homepage 
        or login page.
        """
        # Step 1: Log in to the system
        login_response = self.client.post(self.voter_login_url, {
            'email': 'logouttest@example.com',
            'password': self.test_password,
            'wallet': self.test_wallet
        })
        
        # Verify user is logged in (session has wallet)
        self.assertIn('wallet', self.client.session, 
                     "User should be logged in after successful login")
        
        # Step 2: Log out
        logout_response = self.client.get(self.voter_logout_url)
        
        # Expected Result: User is redirected after logout
        # The voter_logout view redirects to 'home'
        self.assertEqual(logout_response.status_code, 302)
        self.assertRedirects(logout_response, self.home_url)
        
        # Verify user is logged out (wallet removed from session)
        self.assertNotIn('wallet', self.client.session,
                        "User should be logged out after logout")
    
    def test_logout_redirects_to_home(self):
        """
        Test that logout redirects to the home page.
        """
        # First login
        self.client.post(self.voter_login_url, {
            'email': 'logouttest@example.com',
            'password': self.test_password,
            'wallet': self.test_wallet
        })
        
        # Perform logout
        response = self.client.get(self.voter_logout_url, follow=True)
        
        # Should redirect to home page
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'home.html')
    
    def test_logout_then_access_dashboard(self):
        """
        Test that after logout, user cannot access voter dashboard.
        """
        # First login
        self.client.post(self.voter_login_url, {
            'email': 'logouttest@example.com',
            'password': self.test_password,
            'wallet': self.test_wallet
        })
        
        # Perform logout
        self.client.get(self.voter_logout_url)
        
        # Try to access voter dashboard
        dashboard_url = reverse('voter_dashboard')
        response = self.client.get(dashboard_url)
        
        # Should be redirected to login page
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('voter_login'))
    
    def test_logout_when_not_logged_in(self):
        """
        Test that logging out when not logged in doesn't cause errors.
        """
        # Perform logout without being logged in
        response = self.client.get(self.voter_logout_url)
        
        # Should still redirect to home
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.home_url)

