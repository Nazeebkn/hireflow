from rest_framework import serializers

from company_app.models import JobApplication


class CandidateApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    company_name = serializers.CharField(
        source="job.company.company_name",
        read_only=True,
    )

    location = serializers.CharField(
        source="job.location",
        read_only=True,
    )

    class Meta:
        model = JobApplication

        fields = [
            "id",
            "job_title",
            "company_name",
            "location",
            "status",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = fields