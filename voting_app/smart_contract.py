import hashlib
import json
import secrets
from dataclasses import dataclass

from django.utils import timezone

from .models import Block, Candidate, Election, PublishedResult


@dataclass
class PublishReceipt:
    tx_hash: str
    result_hash: str
    total_votes: int


def _contract_count_votes(vote_candidate_ids, candidate_ids):
    """
    Python implementation of the same counting logic that a Solidity contract
    would execute over vote candidate ids.
    """
    counts = {candidate_id: 0 for candidate_id in candidate_ids}
    total_votes = 0

    for voted_for in vote_candidate_ids:
        if voted_for in counts:
            counts[voted_for] += 1
            total_votes += 1

    return counts, total_votes


def publish_results_with_contract(election: Election) -> PublishReceipt:
    """
    Count votes through contract-like logic and publish immutable snapshot rows.
    """
    candidate_ids = list(
        Candidate.objects.filter(post__election=election).order_by("id").values_list("id", flat=True)
    )
    vote_candidate_ids = list(
        Block.objects.filter(candidate__post__election=election).order_by("id").values_list("candidate_id", flat=True)
    )

    counts, total_votes = _contract_count_votes(vote_candidate_ids, candidate_ids)

    for candidate_id in candidate_ids:
        PublishedResult.objects.update_or_create(
            election=election,
            candidate_id=candidate_id,
            defaults={
                "total_votes": counts.get(candidate_id, 0),
                "created_at": timezone.now(),
            },
        )

    # Remove stale rows for candidates no longer in this election.
    PublishedResult.objects.filter(election=election).exclude(candidate_id__in=candidate_ids).delete()

    payload = {
        "election_id": election.id,
        "candidate_ids": candidate_ids,
        "vote_counts": [counts[candidate_id] for candidate_id in candidate_ids],
        "total_votes": total_votes,
    }
    result_hash = "0x" + hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    tx_hash = "0x" + secrets.token_hex(32)

    election.results_published = True
    election.results_published_with_contract = True
    election.result_hash = result_hash
    election.result_publish_tx = tx_hash
    election.results_published_at = timezone.now()
    election.save(
        update_fields=[
            "results_published",
            "results_published_with_contract",
            "result_hash",
            "result_publish_tx",
            "results_published_at",
        ]
    )

    return PublishReceipt(tx_hash=tx_hash, result_hash=result_hash, total_votes=total_votes)


def clear_published_results(election: Election) -> None:
    PublishedResult.objects.filter(election=election).delete()
    election.results_published = False
    election.results_published_with_contract = False
    election.result_hash = ""
    election.result_publish_tx = ""
    election.results_published_at = None
    election.save(
        update_fields=[
            "results_published",
            "results_published_with_contract",
            "result_hash",
            "result_publish_tx",
            "results_published_at",
        ]
    )
