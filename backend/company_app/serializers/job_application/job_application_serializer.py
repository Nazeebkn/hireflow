from rest_framework import serializers

from company_app.models import JobApplication, Job, AIInterview


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

    company_logo = serializers.SerializerMethodField()
    
    ai_interview = serializers.SerializerMethodField()

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
            "ai_interview",
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

    def get_company_logo(self, obj):
        if (
            obj.job
            and obj.job.company
            and obj.job.company.company_logo
        ):
            return obj.job.company.company_logo.url

        return None
    
    
    def get_ai_interview(self, obj):
        interview = getattr(obj, "ai_interview", None)

        if not interview:
            return None

        return {
            "id": interview.id,
            "scheduled_at": interview.scheduled_at,
            "duration": interview.duration,
            "status": interview.status,
            "started_at": interview.started_at,
            "completed_at": interview.completed_at,
        }

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