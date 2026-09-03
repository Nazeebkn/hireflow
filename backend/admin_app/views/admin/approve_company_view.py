from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from admin_app.permissions import IsAdminUser

from admin_app.services.admin.approve_company_service import (
    ApproveCompanyService,
)


class ApproveCompanyAPIView(APIView):
    
    permission_classes = [
            IsAuthenticated,
            IsAdminUser,
        ]

    def patch(self, request, company_id):

        ApproveCompanyService.approve_company(
            company_id
        )

        return Response(
            {
                "message": "Company approved successfully."
            },
            status=status.HTTP_200_OK,
        )