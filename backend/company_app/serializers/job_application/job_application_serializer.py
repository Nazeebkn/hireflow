from rest_framework import serializers

from company_app.models import JobApplication, Job


class JobApplicationSerializer(serializers.ModelSerializer):

    candidate_name = serializers.SerializerMethodField()

    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )

    company_name = serializers.CharField(
        source="job.company.company_name",
        read_only=True,
    )

    company_logo = serializers.CharField(
        source="job.company.company_logo",
        read_only=True,
        allow_null=True,
    )

    job_location = serializers.CharField(
        source="job.location",
        read_only=True,
    )

    work_mode = serializers.CharField(
        source="job.work_mode",
        read_only=True,
    )

    employment_type = serializers.CharField(
        source="job.employment_type",
        read_only=True,
    )

    class Meta:
        model = JobApplication

        fields = [
            "id",
            "job",
            "candidate_name",
            "job_title",
            "company_name",
            "company_logo",
            "job_location",
            "work_mode",
            "employment_type",
            "submitted_resume",
            "status",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "candidate_name",
            "job_title",
            "company_name",
            "company_logo",
            "job_location",
            "work_mode",
            "employment_type",
            "submitted_resume",
            "status",
            "applied_at",
            "updated_at",
        ]

    def get_candidate_name(self, obj):
        if not obj.candidate:
            return "Candidate"

        return (
            f"{obj.candidate.first_name} "
            f"{obj.candidate.last_name}"
        ).strip()

    def validate_job(self, value):
        if not value:
            raise serializers.ValidationError(
                "Job is required."
            )

        if value.status != Job.JobStatus.PUBLISHED:
            raise serializers.ValidationError(
                "You can only apply for a published job."
            )

        return value