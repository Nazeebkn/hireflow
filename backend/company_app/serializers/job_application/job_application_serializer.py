from rest_framework import serializers

from company_app.models import Job, JobApplication
from candidate_app.models import AIInterviewReport


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

    resume_report = serializers.SerializerMethodField()

    interview_report = serializers.SerializerMethodField()

    resume_screening_status = serializers.SerializerMethodField()

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

            "resume_report",
            "interview_report",

            "resume_screening_error",
            "resume_screening_status",

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

            "ai_interview",
            "resume_report",
            "interview_report",

            "resume_screening_error",
            "resume_screening_status",

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

    def get_resume_screening_status(self, obj):

        if getattr(obj, "resume_screening", None) is not None:
            return "SUCCESS"

        if obj.resume_screening_error:
            return obj.resume_screening_error

        if (
            obj.status
            == JobApplication.ApplicationStatus.RESUME_SCREENING
        ):
            return "PROCESSING"

        return "OTHER_ERROR"

    def get_ai_interview(self, obj):

        interview = getattr(
            obj,
            "ai_interview",
            None,
        )

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

    def get_resume_report(self, obj):

        screening = getattr(
            obj,
            "resume_screening",
            None,
        )

        if not screening:
            return None

        return {
            "id": screening.id,
            "overall_score": screening.overall_score,
            "skills_score": screening.skills_score,
            "experience_score": screening.experience_score,
            "education_score": screening.education_score,
            "recommendation": screening.recommendation,
            "summary": screening.summary,
            "strengths": screening.strengths,
            "gaps": screening.gaps,
            "created_at": screening.created_at,
            "updated_at": screening.updated_at,
        }

    def get_interview_report(self, obj):

        interview = getattr(
            obj,
            "ai_interview",
            None,
        )

        if not interview:
            return None

        report = AIInterviewReport.objects.filter(
            interview=interview
        ).first()

        if not report:
            return None

        return {
            "id": report.id,
            "interview": report.interview_id,
            "overall_score": report.overall_score,
            "total_questions": report.total_questions,
            "answered_questions": report.answered_questions,
            "strengths": report.strengths,
            "areas_to_improve": report.areas_to_improve,
            "skill_analysis": report.skill_analysis,
            "recommendation": report.recommendation,
            "summary": report.summary,
            "generated_at": report.generated_at,
            "updated_at": report.updated_at,
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