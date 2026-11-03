from rest_framework.exceptions import NotFound

from candidate_app.repositories.candidate_profile_completion_repository import (
    CandidateProfileCompletionRepository,
)
from candidate_app.repositories.candidate_profile_repository import (
    CandidateProfileRepository,
)


class CandidateProfileCompletionService:

    @staticmethod
    def complete_profile(user):

        profile = CandidateProfileRepository.get_by_user(user)

        if not profile:
            raise NotFound(
                "Candidate profile not found."
            )

        return (
            CandidateProfileCompletionRepository.complete_profile(
                user
            )
        )