from rest_framework import serializers

from company_app.models import Company


class CompanyDetailsSerializer(serializers.ModelSerializer):

    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True,
    )

    jobs = serializers.SerializerMethodField()

    class Meta:
        model = Company

        fields = [
            "id",
            "user",
            "company_name",
            "industry",
            "company_size",
            "website",
            "description",
            "contact_person",
            "contact_phone",
            "country",
            "state",
            "city",
            "address",
            "company_logo",
            "verification_document",
            "approval_status",
            "rejection_reason",
            "created_at",
            "is_active",
            "jobs",
        ]

    def get_jobs(self, obj):
        jobs = obj.jobs.all().order_by("-created_at")

        return [
            {
                "id": job.id,
                "title": job.title,
                "description": job.description,
                "location": job.location,
                "work_mode": job.work_mode,
                "employment_type": job.employment_type,
                "skills": job.skills,
                "experience_required": job.experience_required,
                "education": job.education,
                "position": job.position,
                "minimum_salary": job.minimum_salary,
                "maximum_salary": job.maximum_salary,
                "application_deadline": job.application_deadline,
                "status": job.status,
                "published_at": job.published_at,
                "closed_at": job.closed_at,
                "created_at": job.created_at,
                "updated_at": job.updated_at,
                "application_count": job.applications.count(),
            }
            for job in jobs
        ]