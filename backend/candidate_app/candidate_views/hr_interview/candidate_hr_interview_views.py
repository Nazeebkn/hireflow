from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from candidate_app.serializers.hr_interview.candidate_hr_interview_serializer import (
    CandidateHRInterviewSerializer,
)
from company_app.models import HRInterview


class CandidateHRInterviewListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        interviews = (
            HRInterview.objects
            .filter(application__candidate=candidate)
            .select_related(
                "application",
                "application__job",
            )
            .order_by("-scheduled_at")
        )

        serializer = CandidateHRInterviewSerializer(
            interviews,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )