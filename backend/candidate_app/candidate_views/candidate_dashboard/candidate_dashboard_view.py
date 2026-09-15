from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from candidate_app.services.candidate_dashboard.candidate_dashboard_service import (
    CandidateDashboardService,
)

from candidate_app.serializers.candidate_dashboard.candidate_dashboard_serializer import (
    CandidateDashboardSerializer,
)


class CandidateDashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        dashboard_data = CandidateDashboardService.get_dashboard(
            request.user
        )

        serializer = CandidateDashboardSerializer(
            dashboard_data
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )