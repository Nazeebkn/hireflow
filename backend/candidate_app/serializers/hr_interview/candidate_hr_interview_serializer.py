from rest_framework import serializers

from company_app.models import HRInterview


class CandidateHRInterviewSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(
        source="application.job.title",
        read_only=True,
    )

    class Meta:
        model = HRInterview

        fields = [
            "id",
            "job_title",
            "scheduled_at",
            "duration",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields