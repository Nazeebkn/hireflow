from rest_framework.exceptions import NotFound

from candidate_app.repositories.candidate_job.candidate_job_repository import (
    CandidateJobRepository,
)


class CandidateJobService:

    @staticmethod
    def get_published_jobs(filters=None):
        return CandidateJobRepository.get_published_jobs(filters)

    @staticmethod
    def get_published_job(job_id):
        job = CandidateJobRepository.get_published_job_by_id(job_id)

        if not job:
            raise NotFound("Job not found.")

        return job