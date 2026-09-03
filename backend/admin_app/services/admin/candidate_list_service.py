from admin_app.repositories.admin.candidate_list_repository import (
    CandidateListRepository,
)


class CandidateListService:

    @staticmethod
    def get_all_candidates(
        search=None,
        page=1,
    ):

        return (
            CandidateListRepository.get_all_candidates(
                search,
                page,
            )
        )