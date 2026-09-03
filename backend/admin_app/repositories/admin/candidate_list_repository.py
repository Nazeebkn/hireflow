from django.db.models import Q

from candidate_app.models import CandidateProfile


class CandidateListRepository:

    @staticmethod
    def get_all_candidates(
        search=None,
        page=1,
    ):

        queryset = (
            CandidateProfile.objects
            .select_related("user")
            .order_by("-created_at")
        )

        if search:

            queryset = queryset.filter(
                Q(first_name__icontains=search)
                |
                Q(last_name__icontains=search)
                |
                Q(phone_number__icontains=search)
                |
                Q(location__icontains=search)
            )

        page_size = 10

        start = (page - 1) * page_size

        end = start + page_size

        return queryset[start:end]