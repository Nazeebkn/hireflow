from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_app.permissions import IsAdminUser

from admin_app.serializers.company.company_job_details_serializer import (
    AdminCompanyJobDetailsSerializer,
)

from admin_app.services.company.company_job_details_service import (
    CompanyJobDetailsService,
)


class CompanyJobDetailsAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(
        self,
        request,
        company_id,
        job_id,
    ):

        job, applications = (
            CompanyJobDetailsService
            .get_company_job_details(
                company_id=company_id,
                job_id=job_id,
            )
        )

        serializer = AdminCompanyJobDetailsSerializer(
            job,
            context={
                "request": request,
                "applications": applications,
            },
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )