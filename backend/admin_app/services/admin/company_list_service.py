from admin_app.repositories.admin.company_list_repository import (
    CompanyListRepository,
)


class CompanyListService:

    @staticmethod
    def get_all_companies(
        search=None,
        status=None,
        page=1,
    ):

        return CompanyListRepository.get_all_companies(
            search=search,
            status=status,
            page=page,
        )