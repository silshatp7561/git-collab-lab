from django.urls import path
from django.conf import settings
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_voter, name='register'),
    path('admin-login/', views.admin_login_view, name='admin_login'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-logout/', views.admin_logout, name='admin_logout'),
    path('approve-voter/<int:voter_id>/', views.approve_voter, name='approve_voter'),
    path('remove-voter/<int:voter_id>/', views.remove_voter, name='remove_voter'),
    path('create-election/', views.create_election, name='create_election'),
    path("create-post/", views.create_post, name="create_post"),
    path('create-candidate/', views.create_candidate, name='create_candidate'),
    path('voter-login/', views.voter_login, name='voter_login'),
    path('voter-logout/', views.voter_logout, name='voter_logout'),
    path('voter-dashboard/', views.voter_dashboard, name='voter_dashboard'),
    path('view-election/<int:election_id>/', views.view_election, name='view_election'),
    path('cast-vote/<int:candidate_id>/', views.cast_vote, name='cast_vote'),
    path('toggle-election/<int:election_id>/', views.toggle_election, name='toggle_election'),
    path('mark-completed/<int:election_id>/', views.mark_completed, name='mark_completed'),
    path('publish-results/<int:election_id>/', views.publish_results, name='publish_results'),
    path('hide-results/<int:election_id>/', views.hide_results, name='hide_results'),
    path('results/', views.results_view, name='results'),
    path('blockchain/', views.blockchain_view, name='blockchain'),
]
