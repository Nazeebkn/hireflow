from django.shortcuts import get_object_or_404

from candidate_app.models import CandidateProfile
from company_app.models import JobApplication


class CandidateApplicationsRepository:

    @staticmethod
    def get_candidate(candidate_id):

        return get_object_or_404(
            CandidateProfile.objects.select_related("user"),
            id=candidate_id,
        )

    @staticmethod
    def get_candidate_applications(candidate):

        return (
            JobApplication.objects
            .filter(candidate=candidate)
            .select_related(
                "job",
                "job__company",
            )
            .order_by("-applied_at")
        )