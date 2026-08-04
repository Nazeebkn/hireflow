from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from admin_app.services.admin.pending_company_service import (
    PendingCompanyService,
)

from admin_app.serializers.admin.pending_company_serializer import (
    PendingCompanySerializer,
)


class PendingCompanyListAPIView(APIView):

    def get(self, request):

        companies = (
            PendingCompanyService.get_pending_companies()
        )

        serializer = PendingCompanySerializer(
            companies,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )