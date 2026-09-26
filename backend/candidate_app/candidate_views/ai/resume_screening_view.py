from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from candidate_app.services.ai.resume_screening_service import (
    ResumeScreeningService,
)

from candidate_app.serializers.ai.resume_screening_serializer import (
    ResumeScreeningSerializer,
)

from company_app.services.job_application.job_application_service import (
    JobApplicationService,
)


class ResumeScreeningReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, application_id):

        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if candidate:
            application = JobApplicationService.get_application(
                candidate,
                application_id,
            )

        elif company:
            application = (
                JobApplicationService.get_application_for_company(
                    company,
                    application_id,
                )
            )

        else:
            raise PermissionDenied(
                "You do not have permission to view this report."
            )

        screening = ResumeScreeningService.get_screening(
            application
        )

        serializer = ResumeScreeningSerializer(screening)

        return Response(
            {
                "screening": serializer.data
            },
            status=status.HTTP_200_OK,
        )