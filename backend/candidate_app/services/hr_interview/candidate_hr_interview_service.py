from rest_framework.exceptions import NotFound, ValidationError


from candidate_app.repositories.hr_interview.candidate_hr_interview_repository import (
    CandidateHRInterviewRepository,
)

import os
from datetime import timedelta

from django.utils import timezone

from company_app.models import HRInterview
from core.services.livekit_service import LiveKitService


class CandidateHRInterviewService:

    @staticmethod
    def get_candidate_hr_interviews(candidate):

        if not candidate:
            raise NotFound("Candidate profile not found.")

        return CandidateHRInterviewRepository.get_candidate_hr_interviews(
            candidate
        )
        
    
    
    @staticmethod
    def generate_candidate_interview_token(
        candidate,
        interview_id,
    ):
        if not candidate:
            raise NotFound("Candidate profile not found.")

        interview = (
            CandidateHRInterviewRepository
            .get_interview_for_candidate(
                interview_id=interview_id,
                candidate=candidate,
            )
        )

        if not interview:
            raise NotFound("HR interview not found.")

        if interview.status != HRInterview.InterviewStatus.SCHEDULED:
            raise ValidationError(
                "This interview is not available to join."
            )

        join_available_at = (
            interview.scheduled_at - timedelta(minutes=10)
        )

        if timezone.now() < join_available_at:
            raise ValidationError(
                "Interview joining is not available yet."
            )

        livekit_url = os.getenv("LIVEKIT_URL")

        if not livekit_url:
            raise ValidationError(
                "LiveKit server URL is not configured."
            )

        room_name = f"hr-interview-{interview.id}"

        participant_name = (
            f"{candidate.first_name} {candidate.last_name}"
        ).strip() or "Candidate"

        try:
            token = LiveKitService.generate_token(
                room_name=room_name,
                identity=f"candidate-{candidate.id}",
                participant_name=participant_name,
            )
        except ValueError as error:
            raise ValidationError(str(error))

        return {
            "token": token,
            "url": livekit_url,
            "room_name": room_name,
        }
