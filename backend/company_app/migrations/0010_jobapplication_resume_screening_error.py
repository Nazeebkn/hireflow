from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("company_app", "0009_aiinterview"),
    ]

    operations = [
        migrations.AddField(
            model_name="jobapplication",
            name="resume_screening_error",
            field=models.CharField(
                blank=True,
                choices=[
                    ("QUOTA_ERROR", "Quota error"),
                    ("OTHER_ERROR", "Other error"),
                ],
                max_length=20,
                null=True,
            ),
        ),
    ]
