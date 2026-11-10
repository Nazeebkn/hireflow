
from rest_framework import serializers

from company_app.models import HRInterview


class CandidateHRInterviewSerializer(serializers.ModelSerializer):

    application_id = serializers.IntegerField(
        read_only=True,
    )

    job_title = serializers.CharField(
        source="application.job.title",
        read_only=True,
    )

    status = serializers.ChoiceField(
        choices=HRInterview.InterviewStatus.choices,
        read_only=True,
    )

    report_status = serializers.ChoiceField(
        choices=HRInterview.ReportStatus.choices,
        read_only=True,
    )

    result = serializers.ChoiceField(
        choices=HRInterview.InterviewResult.choices,
        read_only=True,
        allow_null=True,
    )

    cancellation_reason = serializers.ChoiceField(
        choices=HRInterview.CancellationReason.choices,
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = HRInterview

        fields = [
            "id",
            "application_id",
            "job_title",
            "scheduled_at",
            "duration",
            "status",
            "report_status",
            "result",
            "feedback",
            "technical_skills_rating",
            "communication_rating",
            "problem_solving_rating",
            "cancellation_reason",
            "cancellation_note",
            "cancelled_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = fields

    def to_representation(self, instance):

        data = super().to_representation(instance)

        # Do not expose interview report before submission.
        if instance.report_status != HRInterview.ReportStatus.SUBMITTED:
            data["result"] = None
            data["feedback"] = None
            data["technical_skills_rating"] = None
            data["communication_rating"] = None
            data["problem_solving_rating"] = None

        return data
