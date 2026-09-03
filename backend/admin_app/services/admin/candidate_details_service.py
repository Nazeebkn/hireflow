from admin_app.repositories.admin.candidate_details_repository import (
    CandidateDetailsRepository,
)


class CandidateDetailsService:

    @staticmethod
    def get_candidate_details(candidate_id):

        return (
            CandidateDetailsRepository.get_candidate_details(
                candidate_id
            )
        )