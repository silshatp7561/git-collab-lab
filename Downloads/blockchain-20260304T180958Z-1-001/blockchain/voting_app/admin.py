from django.contrib import admin

from .models import Block, Candidate, Election, Post, PublishedResult, Voter


@admin.register(Election)
class ElectionAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "is_completed",
        "results_published",
        "results_published_with_contract",
        "created_at",
    )
    list_filter = ("is_active", "is_completed", "results_published")
    search_fields = ("name",)


@admin.register(Voter)
class VoterAdmin(admin.ModelAdmin):
    list_display = ("email", "wallet_address", "approved", "created_at")
    list_filter = ("approved",)
    search_fields = ("email", "wallet_address")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("name", "election")
    search_fields = ("name", "election__name")


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ("name", "post", "department", "semester", "votes")
    list_filter = ("post__election",)
    search_fields = ("name", "post__name", "post__election__name")


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("id", "voter_wallet", "candidate", "gas_used", "timestamp")
    search_fields = ("voter_wallet", "candidate__name", "candidate__post__election__name")


@admin.register(PublishedResult)
class PublishedResultAdmin(admin.ModelAdmin):
    list_display = ("election", "candidate", "total_votes", "created_at")
    list_filter = ("election",)
