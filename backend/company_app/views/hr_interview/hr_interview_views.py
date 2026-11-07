
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from company_app.serializers.hr_interview.hr_interview_serializer import (
    HRInterviewSerializer,
)

from company_app.services.hr_interview.hr_interview_service import (
    HRInterviewService,
)


class CompanyHRInterviewScheduleAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):

        serializer = HRInterviewSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        try:
            company = getattr(
                request.user,
                "company_profile",
                None,
            )

            interview = HRInterviewService.schedule_interview(
                company=company,
                application_id=application_id,
                scheduled_at=serializer.validated_data["scheduled_at"],
                duration=serializer.validated_data["duration"],
            )

            response_serializer = HRInterviewSerializer(interview)

            return Response(
                {
                    "message": "HR interview scheduled successfully.",
                    "interview": response_serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as error:
            from rest_framework.exceptions import APIException

            if isinstance(error, APIException):
                raise

            return Response(
                {"message": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )
