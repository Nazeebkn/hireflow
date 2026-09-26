from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from candidate_app.models import AIInterviewQuestion

from candidate_app.serializers.ai.ai_interview_answer_serializer import (
    AIInterviewAnswerSerializer,
)

from candidate_app.services.ai.ai_interview_service import (
    AIInterviewService,
)


class SubmitAIInterviewAnswerAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, question_id):

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

        question = (
            AIInterviewQuestion.objects
            .filter(
                id=question_id,
                interview__application__candidate=candidate,
            )
            .select_related(
                "interview",
                "interview__application",
                "interview__application__candidate",
            )
            .first()
        )

        if not question:
            return Response(
                {
                    "message": "Interview question not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AIInterviewAnswerSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        audio_recording = serializer.validated_data.get(
            "audio_recording"
        )

        answer_text = serializer.validated_data.get(
            "answer_text"
        )
        
        submitted_code = serializer.validated_data.get(
            "submitted_code"
        )

        print("AUDIO FILE:", audio_recording)
        print(
            "AUDIO NAME:",
            audio_recording.name if audio_recording else None,
        )
        print(
            "AUDIO TYPE:",
            audio_recording.content_type
            if audio_recording
            else None,
        )
        print(
            "AUDIO SIZE:",
            audio_recording.size
            if audio_recording
            else None,
        )

        print("ANSWER TEXT:", answer_text)

        try:

            if question.question_type == "CODING":

                answer = AIInterviewService.submit_coding_answer(
                    question=question,
                    submitted_code=submitted_code,
                )

            else:

                answer = AIInterviewService.submit_voice_answer(
                    question=question,
                    audio_recording=audio_recording,
                    answer_text=answer_text,
                )

        except Exception as exc:

            return Response(
                {
                    "message": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        response_serializer = AIInterviewAnswerSerializer(
            answer
        )

        message = (
            "Coding answer submitted successfully."
            if question.question_type == "CODING"
            else "Voice answer submitted successfully."
        )

        return Response(
            {
                "message": message,
                "answer": response_serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )