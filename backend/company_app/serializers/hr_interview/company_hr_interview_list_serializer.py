from rest_framework import serializers

from company_app.models import HRInterview, JobApplication


class CompanyHRInterviewPendingSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    profile_picture = serializers.CharField(
        source="candidate.profile_picture",
        read_only=True,
    )
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )
    ai_score = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "candidate_name",
            "profile_picture",
            "job_title",
            "ai_score",
            "status",
            "applied_at",
        ]

    def get_candidate_name(self, obj):
        return (
            f"{obj.candidate.first_name} "
            f"{obj.candidate.last_name}"
        ).strip()

    def get_ai_score(self, obj):
        report = getattr(
            getattr(obj, "ai_interview", None),
            "candidate_report",
            None,
        )
        return report.overall_score if report else None


class CompanyHRInterviewListSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(
        source="application.id",
        read_only=True,
    )
    candidate_name = serializers.SerializerMethodField()
    profile_picture = serializers.CharField(
        source="application.candidate.profile_picture",
        read_only=True,
    )
    job_title = serializers.CharField(
        source="application.job.title",
        read_only=True,
    )
    ai_score = serializers.SerializerMethodField()

    class Meta:
        model = HRInterview
        fields = [
            "id",
            "application_id",
            "candidate_name",
            "profile_picture",
            "job_title",
            "ai_score",
            "scheduled_at",
            "duration",
            "status",
        ]

    def get_candidate_name(self, obj):
        candidate = obj.application.candidate
        return (
            f"{candidate.first_name} "
            f"{candidate.last_name}"
        ).strip()

    def get_ai_score(self, obj):
        ai_interview = getattr(
            obj.application,
            "ai_interview",
            None,
        )

        if not ai_interview:
            return None

        report = getattr(
            ai_interview,
            "candidate_report",
            None,
        )

        return report.overall_score if report else None