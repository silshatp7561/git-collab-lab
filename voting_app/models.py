from django.db import models
from django.utils import timezone
import hashlib
import json


# Voter Model
class Voter(models.Model):
    email = models.EmailField(unique=True, null=True, blank=True)
    password_hash = models.CharField(max_length=128, default="", blank=True)
    wallet_address = models.CharField(max_length=100, unique=True)
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.email or self.wallet_address


# Election Model
class Election(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)
    results_published = models.BooleanField(default=False)
    results_published_with_contract = models.BooleanField(default=False)
    result_publish_tx = models.CharField(max_length=120, blank=True, default="")
    result_hash = models.CharField(max_length=80, blank=True, default="")
    results_published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Post Model (President, Secretary, etc.)
class Post(models.Model):
    name = models.CharField(max_length=100)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.election.name}"


# Candidate Model
class Candidate(models.Model):
    name = models.CharField(max_length=100)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    votes = models.IntegerField(default=0)  # for quick result display
    semester = models.IntegerField(null=True, blank=True)
    department = models.CharField(max_length=100, blank=True, default="")

    def __str__(self):
        return f"{self.name} ({self.post.name})"


class PublishedResult(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    total_votes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("election", "candidate")

    def __str__(self):
        return f"{self.election.name}: {self.candidate.name}={self.total_votes}"


# Blockchain Block Model
class Block(models.Model):
    voter_wallet = models.CharField(max_length=100)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    gas_used = models.IntegerField(default=21000)

    timestamp = models.DateTimeField(default=timezone.now)
    previous_hash = models.CharField(max_length=256)
    hash = models.CharField(max_length=256)

    def calculate_hash(self):
        block_data = {
            "voter_wallet": self.voter_wallet,
            "candidate": self.candidate.id,
            "timestamp": str(self.timestamp),
            "previous_hash": self.previous_hash
        }

        block_string = json.dumps(block_data, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def save(self, *args, **kwargs):
        if not self.hash:
            self.hash = self.calculate_hash()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Block - {self.hash[:10]}"
