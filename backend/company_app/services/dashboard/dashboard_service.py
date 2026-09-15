from django.core.exceptions import ValidationError

from users.models import User

from company_app.repositories.dashboard.dashboard_repository import (
    DashboardRepository,
)


class DashboardService:

    @staticmethod
    def get_company_dashboard(user):

        if user.role != User.UserRole.COMPANY:
            raise ValidationError(
                "Only company users can access the dashboard."
            )

        company = getattr(
            user,
            "company_profile",
            None
        )

        if not company:
            raise ValidationError(
                "Company profile not found."
            )

        stats = DashboardRepository.get_job_counts(
            company
        )

        recent_applications = (
            DashboardRepository.get_recent_applications(
                company
            )
        )

        draft_jobs, deadline_jobs = (
            DashboardRepository.get_jobs_requiring_attention(
                company
            )
        )

        recent_activity = (
            DashboardRepository.get_recent_activity(
                company
            )
        )

        attention_jobs = []

        for job in draft_jobs:
            attention_jobs.append({
                "id": job.id,
                "title": job.title,
                "reason": "This job is still in draft.",
                "status": job.status,
                "created_at": job.created_at,
                "updated_at": job.updated_at,
            })

        for job in deadline_jobs:
            attention_jobs.append({
                "id": job.id,
                "title": job.title,
                "reason": "Application deadline is approaching.",
                "status": job.status,
                "application_deadline": job.application_deadline,
                "created_at": job.created_at,
                "updated_at": job.updated_at,
            })

        return {
            "stats": stats,
            "recent_applications": recent_applications,
            "attention_jobs": attention_jobs[:5],
            "recent_activity": recent_activity,
        }