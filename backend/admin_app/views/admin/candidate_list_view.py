from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from admin_app.services.admin.candidate_list_service import (
    CandidateListService,
)

from admin_app.serializers.admin.candidate_list_serializer import (
    CandidateListSerializer,
)

from rest_framework.permissions import IsAuthenticated

from admin_app.permissions import IsAdminUser

class CandidateListAPIView(APIView):
    
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(self, request):

        search = request.query_params.get("search")

        page = int(
            request.query_params.get("page", 1)
        )

        candidates = (
            CandidateListService.get_all_candidates(
                search,
                page,
            )
        )

        serializer = CandidateListSerializer(
            candidates,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )