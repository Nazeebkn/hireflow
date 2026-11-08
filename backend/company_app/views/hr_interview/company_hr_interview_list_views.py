from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company_app.serializers.hr_interview.company_hr_interview_list_serializer import (
    CompanyHRInterviewPendingSerializer,
    CompanyHRInterviewListSerializer,
)
from company_app.services.hr_interview.hr_interview_service import (
    HRInterviewService,
)


class CompanyHRInterviewListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        if not company:
            return Response(
                {"message": "Company profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = HRInterviewService.get_company_hr_interviews(
            company=company,
        )

        response_data = {
            "pending_schedule": CompanyHRInterviewPendingSerializer(
                data["pending_schedule"],
                many=True,
            ).data,
            "scheduled": CompanyHRInterviewListSerializer(
                data["scheduled"],
                many=True,
            ).data,
            "completed": CompanyHRInterviewListSerializer(
                data["completed"],
                many=True,
            ).data,
            "cancelled": CompanyHRInterviewListSerializer(
                data["cancelled"],
                many=True,
            ).data,
            "missed": CompanyHRInterviewListSerializer(
                data["missed"],
                many=True,
            ).data,
        }

        return Response(
            response_data,
            status=status.HTTP_200_OK,
        )