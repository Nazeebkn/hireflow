from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from candidate_app.serializers.hr_interview.candidate_hr_interview_serializer import (
    CandidateHRInterviewSerializer,
)
from candidate_app.services.hr_interview.candidate_hr_interview_service import (
    CandidateHRInterviewService,
)



class CandidateHRInterviewListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        interviews = (
            CandidateHRInterviewService.get_candidate_hr_interviews(
                candidate
            )
        )

        serializer = CandidateHRInterviewSerializer(
            interviews,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CandidateHRInterviewTokenAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interview_id):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        token_data = (
            CandidateHRInterviewService
            .generate_candidate_interview_token(
                candidate=candidate,
                interview_id=interview_id,
            )
        )

        return Response(
            token_data,
            status=status.HTTP_200_OK,
        )



class CandidateContactCompanyAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, interview_id):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        result = CandidateHRInterviewService.contact_company(
            candidate=candidate,
            interview_id=interview_id,
        )

        return Response(
            result,
            status=status.HTTP_200_OK,
        )