from django.shortcuts import get_object_or_404

from candidate_app.models import CandidateProfile


class CandidateDetailsRepository:

    @staticmethod
    def get_candidate_details(candidate_id):

        return get_object_or_404(
        CandidateProfile.objects.select_related("user"),
        id=candidate_id,
    )