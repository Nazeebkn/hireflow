from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from admin_app.services.admin.candidate_details_service import (
    CandidateDetailsService,
)

from admin_app.serializers.admin.candidate_details_serializer import (
    CandidateDetailsSerializer,
)


class CandidateDetailsAPIView(APIView):

    def get(self, request, candidate_id):

        candidate = (
            CandidateDetailsService.get_candidate_details(
                candidate_id
            )
        )

        serializer = CandidateDetailsSerializer(candidate)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )