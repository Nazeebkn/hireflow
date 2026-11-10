
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

from company_app.serializers.hr_interview.hr_interview_cancel_serializer import (
    HRInterviewCancelSerializer,
)

from company_app.serializers.hr_interview.hr_interview_report_serializer import (
    HRInterviewReportSerializer,
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
                reschedule_reason=serializer.validated_data.get(
                    "reschedule_reason", ""
                ),
                reschedule_note=serializer.validated_data.get(
                    "reschedule_note", ""
                ),
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



class CompanyHRInterviewCancelAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):

        serializer = HRInterviewCancelSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        interview = HRInterviewService.cancel_interview(
            company=company,
            application_id=application_id,
            cancellation_reason=serializer.validated_data[
                "cancellation_reason"
            ],
            cancellation_note=serializer.validated_data.get(
                "cancellation_note", ""
            ),
        )

        response_serializer = HRInterviewSerializer(interview)

        return Response(
            {
                "message": "HR interview cancelled successfully.",
                "interview": response_serializer.data,
            },
            status=status.HTTP_200_OK,
        )




class CompanyHRInterviewReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):

        serializer = HRInterviewReportSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        company = getattr(
            request.user,
            "company_profile",
            None,
        )

        interview = HRInterviewService.submit_report(
            company=company,
            application_id=application_id,
            report_data=serializer.validated_data,
        )

        return Response(
            {
                "message": "HR interview report submitted successfully.",
                "interview": {
                    "id": interview.id,
                    "application_id": interview.application_id,
                    "status": interview.status,
                    "result": interview.result,
                    **HRInterviewReportSerializer(interview).data,
                },
            },
            status=status.HTTP_200_OK,
        )
        
        
        
        

class CompanyHRInterviewTokenAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interview_id):
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

        participant_name = (
            f"{getattr(request.user, 'first_name', '')} "
            f"{getattr(request.user, 'last_name', '')}"
        ).strip() or request.user.get_username()

        token_data = HRInterviewService.generate_company_interview_token(
            company=company,
            interview_id=interview_id,
            participant_identity=f"company-{request.user.id}",
            participant_name=participant_name,
        )

        return Response(
            token_data,
            status=status.HTTP_200_OK,
        )
