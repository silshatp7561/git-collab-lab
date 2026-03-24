# Generated migration for voting_completed and results_hidden fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voting_app', '0009_election_result_hash_election_result_publish_tx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='election',
            name='voting_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='election',
            name='results_hidden',
            field=models.BooleanField(default=False),
        ),
    ]
