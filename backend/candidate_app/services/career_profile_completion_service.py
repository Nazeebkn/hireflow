from candidate_app.services.candidate_education_service import (
    CandidateEducationService,
)

from candidate_app.services.candidate_experience_service import (
    CandidateExperienceService,
)

from candidate_app.services.candidate_skill_service import (
    CandidateSkillService,
)

from candidate_app.services.candidate_job_preference_service import (
    CandidateJobPreferenceService,
)

from django.db import transaction

class CareerProfileCompletionService:

    @staticmethod
    @transaction.atomic
    def complete_career_profile(
        user,
        validated_data,
    ):

        education_data = {
            "education_level": validated_data["education"],
            "institution_name": validated_data["institution_name"],
            "field_of_study": validated_data["qualification"],
            "end_date": f'{validated_data["graduation_year"]}-01-01',
        }

        experience_data = {
            "company_name": validated_data["current_company"],
            "job_title": validated_data["current_job_title"],
        }

        skill_data = {
            "skill_name": validated_data["primary_skill"],
            "proficiency": "BEGINNER",
            "years_of_experience": 0,
        }

        job_preference_data = {
            "preferred_job_role":
                validated_data["preferred_job_role"],

            "preferred_locations": [
                validated_data["preferred_location"]
            ],

            "minimum_salary":
                validated_data["expected_salary"],

            "maximum_salary":
                validated_data["expected_salary"],

            "employment_type": "FULL_TIME",
        }

        CandidateEducationService.create_education(
            user,
            education_data,
        )

        CandidateExperienceService.create_experience(
            user,
            experience_data,
        )

        CandidateSkillService.create_skill(
            user,
            skill_data,
        )

        CandidateJobPreferenceService.create_preference(
            user,
            job_preference_data,
        )