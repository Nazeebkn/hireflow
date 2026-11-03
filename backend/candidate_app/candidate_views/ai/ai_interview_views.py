from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from candidate_app.repositories.ai.ai_interview_report_repository import (
    AIInterviewReportRepository,
)
from candidate_app.serializers.ai.ai_interview_report_serializer import (
    AIInterviewReportSerializer,
)
from candidate_app.serializers.ai.ai_interview_serializer import (
    AIInterviewSerializer,
)
from candidate_app.services.ai.ai_interview_service import (
    AIInterviewService,
)
from company_app.models import AIInterview


class StartAIInterviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interview_id):

        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {
                    "message": "Candidate profile not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        interview = (
            AIInterview.objects
            .filter(
                id=interview_id,
                application__candidate=candidate,
            )
            .select_related(
                "application",
                "application__candidate",
            )
            .first()
        )

        if not interview:
            return Response(
                {
                    "message": "AI interview not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            interview = AIInterviewService.start_interview(
                interview
            )

        except ValidationError as exc:
            message = exc.detail
            if isinstance(message, list):
                message = message[0]

            return Response(
                {
                    "message": str(message)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as exc:
            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AIInterviewSerializer(interview)

        return Response(
            {
                "message": "AI interview started successfully.",
                "interview": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
        
        
        
        
class CompleteAIInterviewAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, interview_id):

        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {
                    "message": "Candidate profile not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        interview = (
            AIInterview.objects
            .filter(
                id=interview_id,
                application__candidate=candidate,
            )
            .select_related(
                "application",
                "application__candidate",
                "application__job",
            )
            .first()
        )

        if not interview:
            return Response(
                {
                    "message": "AI interview not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:

            interview, report = (
                AIInterviewService.complete_interview(
                    interview
                )
            )

        except ValidationError as exc:

            message = exc.detail

            if isinstance(message, list):
                message = message[0]

            return Response(
                {
                    "message": str(message)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as exc:

            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview_serializer = AIInterviewSerializer(
            interview
        )

        return Response(
            {
                "message": "AI interview completed successfully.",
                "interview": interview_serializer.data,
                "report_id": report.id,
            },
            status=status.HTTP_200_OK,
        )
        
        
        
class AIInterviewReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, interview_id):

        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {
                    "message": "Candidate profile not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        interview = (
            AIInterview.objects
            .filter(
                id=interview_id,
                application__candidate=candidate,
            )
            .first()
        )

        if not interview:
            return Response(
                {
                    "message": "AI interview not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        report = (
            AIInterviewReportRepository
            .get_by_interview(interview)
        )

        if not report:
            return Response(
                {
                    "message": "AI interview report not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AIInterviewReportSerializer(report)

        return Response(
            {
                "report": serializer.data
            },
            status=status.HTTP_200_OK,
        )