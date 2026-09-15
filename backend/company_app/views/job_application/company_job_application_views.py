from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from company_app.serializers.job_application.company_job_application_serializer import (
    CompanyJobApplicationSerializer,
)

from company_app.services.job_application.job_application_service import (
    JobApplicationService,
)


class CompanyJobApplicationsAPIView(APIView):

    def get(self, request, job_id):
        print("USER:", request.user)
        print("USER ID:", request.user.id)
        print("AUTHENTICATED:", request.user.is_authenticated)
        print(
            "COMPANY PROFILE:",
            getattr(request.user, "company_profile", None),
        )
        try:

            company = getattr(
                request.user,
                "company_profile",
                None,
            )

            job, applications = (
                JobApplicationService.get_job_applications(
                    company=company,
                    job_id=job_id,
                )
            )

            serializer = CompanyJobApplicationSerializer(
                applications,
                many=True,
            )

            return Response(
                {
                    "job_id": job.id,
                    "total_applications": applications.count(),
                    "applications": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as error:

            return Response(
                {
                    "message": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )