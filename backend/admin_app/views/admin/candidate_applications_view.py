from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import IsAuthenticated

from admin_app.permissions import IsAdminUser

from admin_app.services.admin.candidate_applications_service import (
    CandidateApplicationsService,
)

from admin_app.serializers.admin.candidate_applications_serializer import (
    CandidateApplicationSerializer,
)


class CandidateApplicationsAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAdminUser,
    ]

    def get(self, request, candidate_id):

        candidate, applications = (
            CandidateApplicationsService
            .get_candidate_applications(
                candidate_id
            )
        )

        serializer = CandidateApplicationSerializer(
            applications,
            many=True,
        )

        total_applications = applications.count()

        selected_applications = applications.filter(
            status="SELECTED"
        ).count()

        interview_count = applications.filter(
            status__in=[
                "AI_INTERVIEW",
                "FINAL_INTERVIEW",
            ]
        ).count()

        hired_count = applications.filter(
            status="HIRED"
        ).count()

        return Response(
            {
                "candidate_id": candidate.id,

                "total_applications": total_applications,

                "selected_applications": selected_applications,

                "interview_count": interview_count,

                "hired_count": hired_count,

                "applications": serializer.data,
            },
            status=status.HTTP_200_OK,
        )