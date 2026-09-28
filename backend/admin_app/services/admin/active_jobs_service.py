from admin_app.repositories.admin.active_jobs_repository import ActiveJobsRepository


class ActiveJobsService:

    @staticmethod
    def get_active_jobs_count():
        return ActiveJobsRepository.get_active_jobs_count()