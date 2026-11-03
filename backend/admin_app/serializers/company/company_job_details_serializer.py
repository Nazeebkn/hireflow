from rest_framework import serializers

from company_app.models import Job, JobApplication


class AdminJobApplicationSerializer(
    serializers.ModelSerializer
):

    candidate_name = serializers.SerializerMethodField()

    candidate_initials = serializers.SerializerMethodField()

    resume_report = serializers.SerializerMethodField()

    ai_interview = serializers.SerializerMethodField()

    interview_report = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication

        fields = [
            "id",
            "candidate_name",
            "candidate_initials",
            "status",
            "applied_at",
            "updated_at",
            "submitted_resume",
            "resume_report",
            "ai_interview",
            "interview_report",
        ]

        read_only_fields = fields

    def get_candidate_name(self, obj):

        if not obj.candidate:
            return "Candidate"

        return (
            f"{obj.candidate.first_name} "
            f"{obj.candidate.last_name}"
        ).strip() or "Candidate"

    def get_candidate_initials(self, obj):

        if not obj.candidate:
            return "C"

        first_name = (
            obj.candidate.first_name or ""
        ).strip()

        last_name = (
            obj.candidate.last_name or ""
        ).strip()

        initials = ""

        if first_name:
            initials += first_name[0].upper()

        if last_name:
            initials += last_name[0].upper()

        return initials or "C"

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

    def get_interview_report(self, obj):

        interview = getattr(
            obj,
            "ai_interview",
            None,
        )

        if not interview:
            return None

        report = getattr(
            interview,
            "candidate_report",
            None,
        )

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


class AdminCompanyJobDetailsSerializer(
    serializers.ModelSerializer
):

    company_name = serializers.CharField(
        source="company.company_name",
        read_only=True,
    )

    application_count = serializers.SerializerMethodField()

    applicants = serializers.SerializerMethodField()

    class Meta:
        model = Job

        fields = [
            "id",
            "company",
            "company_name",
            "title",
            "description",
            "location",
            "work_mode",
            "employment_type",
            "skills",
            "experience_required",
            "education",
            "position",
            "minimum_salary",
            "maximum_salary",
            "application_deadline",
            "status",
            "published_at",
            "closed_at",
            "created_at",
            "updated_at",
            "application_count",
            "applicants",
        ]

        read_only_fields = fields

    def get_application_count(self, obj):

        return obj.applications.count()

    def get_applicants(self, obj):

        applications = self.context.get(
            "applications",
            obj.applications.all(),
        )

        return AdminJobApplicationSerializer(
            applications,
            many=True,
        ).data