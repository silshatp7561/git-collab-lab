from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("voting_app", "0007_voter_email_password_hash"),
    ]

    operations = [
        migrations.AddField(
            model_name="election",
            name="results_published",
            field=models.BooleanField(default=False),
        ),
    ]
