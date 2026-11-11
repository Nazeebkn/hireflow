import os
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework.exceptions import NotFound, ValidationError

from company_app.models import HRInterview
from core.services.livekit_service import LiveKitService

from candidate_app.repositories.hr_interview.candidate_hr_interview_repository import (
    CandidateHRInterviewRepository,
)


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

        if interview.status not in (HRInterview.InterviewStatus.SCHEDULED, HRInterview.InterviewStatus.HR_NO_SHOW):
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
    "scheduled_at": interview.scheduled_at,
    "candidate_joined_at": interview.candidate_joined_at,
    "company_joined_at": interview.company_joined_at,
    "status": interview.status,
}





    @staticmethod
    def contact_company(candidate, interview_id):
        if not candidate:
            raise NotFound("Candidate profile not found.")

        interview = (
            CandidateHRInterviewRepository.get_interview_for_contact(
                interview_id=interview_id,
                candidate=candidate,
            )
        )

        if not interview:
            raise NotFound("HR interview not found.")

        if interview.status not in (
            HRInterview.InterviewStatus.SCHEDULED,
            HRInterview.InterviewStatus.HR_NO_SHOW,
        ):
            raise ValidationError("This interview is not available.")

        deadline = interview.scheduled_at + timedelta(minutes=5)

        if timezone.now() < deadline:
            raise ValidationError(
                "You can contact the company after the 5-minute grace period."
            )

        if (
            not interview.candidate_joined_at
            or interview.candidate_joined_at > deadline
        ):
            raise ValidationError(
                "You must have joined within the 5-minute grace period."
            )

        if interview.company_joined_at:
            raise ValidationError(
                "The company has already joined the interview."
            )

        if interview.contact_company_email_sent_at:
            raise ValidationError(
                "Contact email has already been sent for this interview."
            )

        company_email = interview.application.job.company.user.email

        if not company_email:
            raise ValidationError("Company email is not available.")

        candidate_name = (
            f"{candidate.first_name} {candidate.last_name}"
        ).strip()

        job_title = interview.application.job.title

        subject = "HR Interview No-Show - Follow-up Required"

        message = (
            "Hello HR Team,\n\n"
            "This is to notify you that the scheduled HR interview "
            "was not attended by the HR representative within the "
            "5-minute grace period.\n\n"
            "Interview Details:\n"
            f"Candidate Name: {candidate_name}\n"
            f"Job Position: {job_title}\n"
            f"Scheduled Date & Time: "
            f"{timezone.localtime(interview.scheduled_at).strftime('%d %b %Y, %I:%M %p')}\n"
            "Interview Status: HR No-Show\n\n"
            "The candidate joined the interview within the allowed "
            "grace period, but no HR representative attended.\n\n"
            "Please contact the candidate and arrange a new interview schedule.\n\n"
            "Regards,\n"
            "HireFlow - Recruitment Platform"
        )

        # Atomically claim the email request.
        claimed = (
            CandidateHRInterviewRepository.claim_contact_company_email(
                interview_id=interview.id,
            )
        )

        if not claimed:
            raise ValidationError(
                "Contact email has already been sent for this interview."
            )

        try:
            sent = send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[company_email],
                fail_silently=False,
            )

            if sent != 1:
                raise Exception("Email was not sent.")

        except Exception:
            CandidateHRInterviewRepository.release_contact_company_email_claim(
                interview_id=interview.id,
            )

            raise ValidationError(
                "Unable to send contact email. Please try again."
            )

        return {
            "message": "Company has been notified successfully.",
            "company_email": company_email,
        }
