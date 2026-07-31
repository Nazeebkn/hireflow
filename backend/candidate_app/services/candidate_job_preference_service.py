from rest_framework.exceptions import ValidationError, NotFound

from candidate_app.repositories.candidate_profile_repository import (
    CandidateProfileRepository,
)
from candidate_app.repositories.candidate_job_preference_repository import (
    CandidateJobPreferenceRepository,
)


class CandidateJobPreferenceService:

    @staticmethod
    def create_preference(user, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        preference = CandidateJobPreferenceRepository.get_by_candidate(
            profile
        )

        if preference:
            raise ValidationError(
                "Job preference already exists."
            )

        return CandidateJobPreferenceRepository.create(
            profile,
            validated_data
        )

    @staticmethod
    def get_preference(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        preference = CandidateJobPreferenceRepository.get_by_candidate(
            profile
        )

        if not preference:
            raise NotFound("Job preference not found.")

        return preference

    @staticmethod
    def update_preference(user, validated_data):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound("Candidate profile not found.")

        preference = CandidateJobPreferenceRepository.get_by_candidate(
            profile
        )

        if not preference:
            raise NotFound("Job preference not found.")

        return CandidateJobPreferenceRepository.update(
            preference,
            validated_data
        )