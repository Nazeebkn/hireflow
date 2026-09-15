
from admin_app.repositories.admin.candidate_applications_repository import (
    CandidateApplicationsRepository,
)


class CandidateApplicationsService:

    @staticmethod
    def get_candidate_applications(candidate_id):

        candidate = (
            CandidateApplicationsRepository.get_candidate(
                candidate_id
            )
        )

        applications = (
            CandidateApplicationsRepository
            .get_candidate_applications(candidate)
        )

        return candidate, applications