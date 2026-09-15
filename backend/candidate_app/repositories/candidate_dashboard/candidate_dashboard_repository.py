from candidate_app.models import (
    CandidateProfile,
    CandidateEducation,
    CandidateExperience,
    CandidateSkill,
    CandidateJobPreference,
)

from company_app.models import JobApplication


class CandidateDashboardRepository:

    @staticmethod
    def get_candidate_profile(user):
        return CandidateProfile.objects.filter(
            user=user
        ).first()

    @staticmethod
    def get_education_count(profile):
        return CandidateEducation.objects.filter(
            candidate_profile=profile
        ).count()

    @staticmethod
    def get_experience_count(profile):
        return CandidateExperience.objects.filter(
            candidate_profile=profile
        ).count()

    @staticmethod
    def get_skill_count(profile):
        return CandidateSkill.objects.filter(
            candidate_profile=profile
        ).count()

    @staticmethod
    def get_job_preference(profile):
        return CandidateJobPreference.objects.filter(
            candidate_profile=profile
        ).first()

    # Total applications
    @staticmethod
    def get_application_count(profile):
        return JobApplication.objects.filter(
            candidate=profile
        ).count()

    # Applications currently in recruitment process
    @staticmethod
    def get_active_process_count(profile):
        return JobApplication.objects.filter(
            candidate=profile,
            status__in=[
                JobApplication.ApplicationStatus.RESUME_SCREENING,
                JobApplication.ApplicationStatus.AI_INTERVIEW,
                JobApplication.ApplicationStatus.CLASSIFIED,
                JobApplication.ApplicationStatus.FINAL_INTERVIEW,
            ],
        ).count()

    # Interviews reached/attended stage
    @staticmethod
    def get_interview_count(profile):
        return JobApplication.objects.filter(
            candidate=profile,
            status__in=[
                JobApplication.ApplicationStatus.AI_INTERVIEW,
                JobApplication.ApplicationStatus.FINAL_INTERVIEW,
            ],
        ).count()

    # Offers
    @staticmethod
    def get_offer_count(profile):
        return JobApplication.objects.filter(
            candidate=profile,
            status=JobApplication.ApplicationStatus.SELECTED,
        ).count()