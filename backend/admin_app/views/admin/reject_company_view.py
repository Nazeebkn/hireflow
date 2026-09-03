from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from admin_app.serializers.admin.reject_company_serializer import (
    RejectCompanySerializer,
)

from admin_app.services.admin.reject_company_service import (
    RejectCompanyService,
)

from rest_framework.permissions import IsAuthenticated

from admin_app.permissions import IsAdminUser

class RejectCompanyAPIView(APIView):
    
    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def patch(self, request, company_id):

        serializer = RejectCompanySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        RejectCompanyService.reject_company(
            company_id,
            serializer.validated_data[
                "rejection_reason"
            ],
        )

        return Response(
            {
                "message": "Company rejected successfully."
            },
            status=status.HTTP_200_OK,
        )