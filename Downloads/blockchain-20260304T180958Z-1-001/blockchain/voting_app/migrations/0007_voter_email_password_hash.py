from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("voting_app", "0006_block_gas_used"),
    ]

    operations = [
        migrations.AddField(
            model_name="voter",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="voter",
            name="password_hash",
            field=models.CharField(blank=True, default="", max_length=128),
        ),
    ]
