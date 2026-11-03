from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_app.permissions import IsAdminUser
from admin_app.serializers.admin.company_details_serializer import (
    CompanyDetailsSerializer,
)
from admin_app.services.admin.company_details_service import (
    CompanyDetailsService,
)


class CompanyDetailsAPIView(APIView):
    
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(self, request, company_id):

        company = CompanyDetailsService.get_company(
            company_id
        )

        serializer = CompanyDetailsSerializer(company)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )