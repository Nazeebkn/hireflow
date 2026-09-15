from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from company_app.services.dashboard.dashboard_service import (
    DashboardService,
)

from company_app.serializers.dashboard.dashboard_serializer import (
    DashboardSerializer,
)


class CompanyDashboardAPIView(APIView):

    def get(self, request):

        try:
            dashboard_data = (
                DashboardService.get_company_dashboard(
                    request.user
                )
            )

        except ValidationError as exc:
            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = DashboardSerializer(
            dashboard_data
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )