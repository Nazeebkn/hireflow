from rest_framework.exceptions import NotFound

from candidate_app.repositories.candidate_dashboard.candidate_dashboard_repository import (
    CandidateDashboardRepository,
)


class CandidateDashboardService:

    @staticmethod
    def get_dashboard(user):

        profile = CandidateDashboardRepository.get_candidate_profile(
            user
        )

        if not profile:
            raise NotFound(
                "Candidate profile not found."
            )

        education_count = (
            CandidateDashboardRepository.get_education_count(
                profile
            )
        )

        experience_count = (
            CandidateDashboardRepository.get_experience_count(
                profile
            )
        )

        skill_count = (
            CandidateDashboardRepository.get_skill_count(
                profile
            )
        )

        job_preference = (
            CandidateDashboardRepository.get_job_preference(
                profile
            )
        )

        application_count = (
            CandidateDashboardRepository.get_application_count(
                profile
            )
        )

        active_process_count = (
            CandidateDashboardRepository.get_active_process_count(
                profile
            )
        )

        interview_count = (
            CandidateDashboardRepository.get_interview_count(
                profile
            )
        )

        offer_count = (
            CandidateDashboardRepository.get_offer_count(
                profile
            )
        )

        return {
            "profile": profile,
            "education_count": education_count,
            "experience_count": experience_count,
            "skill_count": skill_count,
            "job_preference": job_preference,
            "application_count": application_count,
            "active_process_count": active_process_count,
            "interview_count": interview_count,
            "offer_count": offer_count,
        }