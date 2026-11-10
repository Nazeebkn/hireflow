
from django.db import transaction
from django.utils import timezone

from rest_framework.exceptions import NotFound, ValidationError

from company_app.models import (
    HRInterview,
    JobApplication,
)

from company_app.repositories.job_application.job_application_repository import (
    JobApplicationRepository,
)

from candidate_app.models import Notification
from candidate_app.services.notification.notification_service import (
    NotificationService,
)

from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
import logging

import os

from core.services.livekit_service import LiveKitService

from company_app.repositories.hr_interview.hr_interview_repository import (
    HRInterviewRepository,
)

logger = logging.getLogger(__name__)

class HRInterviewService:
    
    @staticmethod
    def get_company_hr_interviews(company):

        if not company:
            raise NotFound("Company profile not found.")

        pending = (
            JobApplication.objects
            .filter(
                job__company=company,
                status=JobApplication.ApplicationStatus.FINAL_INTERVIEW,
                hr_interview__isnull=True,
            )
            .select_related(
                "candidate",
                "job",
                "ai_interview__candidate_report",
            )
            .order_by("-updated_at")
        )

        interviews = (
            HRInterview.objects
            .filter(application__job__company=company)
            .select_related(
                "application__candidate",
                "application__job",
                "application__ai_interview__candidate_report",
            )
        )

        return {
            "pending_schedule": pending,
            "scheduled": interviews.filter(
                status=HRInterview.InterviewStatus.SCHEDULED
            ).order_by("scheduled_at"),
            "completed": interviews.filter(
                status=HRInterview.InterviewStatus.COMPLETED
            ).order_by("-updated_at"),
            "cancelled": interviews.filter(
                status=HRInterview.InterviewStatus.CANCELLED
            ).order_by("-updated_at"),
            "missed": interviews.filter(
                status=HRInterview.InterviewStatus.MISSED
            ).order_by("-updated_at"),
        }
        
        


    @staticmethod
    @transaction.atomic
    def schedule_interview(
        company,
        application_id,
        scheduled_at,
        duration,
        reschedule_reason="",
        reschedule_note="",
    ):
        if not company:
            raise NotFound("Company profile not found.")

        application = (
            JobApplicationRepository
            .get_application_by_id_for_company(
                company=company,
                application_id=application_id,
            )
        )

        if not application:
            raise NotFound("Application not found.")

        if (
            application.status
            != JobApplication.ApplicationStatus.FINAL_INTERVIEW
        ):
            raise ValidationError(
                "HR interview can only be scheduled "
                "for candidates who passed the AI interview."
            )

        now = timezone.now()

        if scheduled_at <= now:
            raise ValidationError(
                "Interview date and time must be in the future."
            )

        if duration <= 0:
            raise ValidationError(
                "Interview duration must be greater than zero."
            )

        interview = (
            HRInterview.objects
            .select_for_update()
            .filter(application=application)
            .first()
        )

        is_reschedule = interview is not None

        if interview:
            if interview.status == HRInterview.InterviewStatus.COMPLETED:
                raise ValidationError(
                    "Completed HR interviews cannot be rescheduled."
                )

            # Prevent rescheduling within one hour of the existing start time.
            time_until_interview = interview.scheduled_at - now

            if time_until_interview <= timedelta(hours=1):
                raise ValidationError(
                    "HR interviews cannot be rescheduled "
                    "within one hour of their scheduled start time."
                )

            interview.scheduled_at = scheduled_at
            interview.duration = duration
            interview.status = HRInterview.InterviewStatus.SCHEDULED
            interview.save()

        else:
            interview = HRInterview.objects.create(
                application=application,
                scheduled_at=scheduled_at,
                duration=duration,
            )

        notification_title = (
            "HR Interview Rescheduled"
            if is_reschedule
            else "HR Interview Scheduled"
        )

        notification_message = (
            f"Your HR interview for {application.job.title} "
            f"has been {'rescheduled' if is_reschedule else 'scheduled'} "
            f"for "
            f"{timezone.localtime(interview.scheduled_at).strftime('%d %b %Y, %I:%M %p')}."
        )

        if is_reschedule:
            reason_label = dict(
                HRInterview.RescheduleReason.choices
            ).get(reschedule_reason, reschedule_reason)

            if reason_label:
                notification_message += f"\nReason: {reason_label}"

            if reschedule_note.strip():
                notification_message += (
                    f"\nAdditional Details: {reschedule_note.strip()}"
                )

        
        NotificationService.create_notification(
            user=application.candidate.user,
            notification_type=(
                Notification.NotificationType.HR_INTERVIEW_RESCHEDULED
                if is_reschedule
                else Notification.NotificationType.HR_INTERVIEW_SCHEDULED
            ),
            title=notification_title,
            message=notification_message,
        )

        candidate_name = application.candidate.first_name
        interview_datetime = timezone.localtime(
            interview.scheduled_at
        ).strftime("%d %B %Y, %I:%M %p")

        email_subject = (
            "HireFlow - HR Interview Rescheduled"
            if is_reschedule
            else "HireFlow - HR Interview Scheduled"
        )

        email_message = (
            f"Hello {candidate_name},\n\n"
            f"Your HR interview for {application.job.title} "
            f"has been "
            f"{'rescheduled' if is_reschedule else 'scheduled'}.\n\n"
            f"Date & Time: {interview_datetime}\n"
            f"Duration: {interview.duration} minutes\n\n"
            "Please be available at the scheduled time.\n\n"
            "Regards,\n"
            "HireFlow Team"
        )
        
        if is_reschedule:
            reason_label = dict(
                HRInterview.RescheduleReason.choices
            ).get(reschedule_reason, reschedule_reason)

            if reason_label:
                email_message += (
                    f"\nReschedule Reason: {reason_label}\n"
                )

            if reschedule_note.strip():
                email_message += (
                    f"Additional Details: {reschedule_note.strip()}\n"
                )

        HRInterviewService.send_hr_interview_email(
            recipient_email=application.candidate.user.email,
            subject=email_subject,
            message=email_message,
        )

        return interview


    
    
    
    
    @staticmethod
    @transaction.atomic
    def cancel_interview(
        company,
        application_id,
        cancellation_reason,
        cancellation_note="",
    ):
        if not company:
            raise NotFound("Company profile not found.")

        interview = (
            HRInterview.objects
            .select_for_update()
            .filter(
                application__id=application_id,
                application__job__company=company,
            )
            .select_related(
                "application__candidate__user",
                "application__job",
            )
            .first()
        )

        if not interview:
            raise NotFound("HR interview not found.")

        if interview.status != HRInterview.InterviewStatus.SCHEDULED:
            raise ValidationError(
                "Only scheduled HR interviews can be cancelled."
            )

        valid_reasons = dict(
            HRInterview.CancellationReason.choices
        )

        if cancellation_reason not in valid_reasons:
            raise ValidationError("Invalid cancellation reason.")

        if (
            cancellation_reason
            == HRInterview.CancellationReason.OTHER
            and not cancellation_note.strip()
        ):
            raise ValidationError(
                "Please provide a cancellation note for Other."
            )

        interview.status = HRInterview.InterviewStatus.CANCELLED
        interview.cancellation_reason = cancellation_reason
        interview.cancellation_note = cancellation_note.strip()
        interview.cancelled_at = timezone.now()

        interview.save(
            update_fields=[
                "status",
                "cancellation_reason",
                "cancellation_note",
                "cancelled_at",
                "updated_at",
            ]
        )

        reason_label = valid_reasons[cancellation_reason]

        message = (
            f"Your HR interview for {interview.application.job.title} "
            f"has been cancelled. Reason: {reason_label}."
        )

        if cancellation_note.strip():
            message += f" Note: {cancellation_note.strip()}"

        NotificationService.create_notification(
            user=interview.application.candidate.user,
            notification_type=(
                Notification.NotificationType.HR_INTERVIEW_CANCELLED
            ),
            title="HR Interview Cancelled",
            message=message,
        )
        
        
        
        candidate_name = interview.application.candidate.first_name

        interview_datetime = timezone.localtime(
            interview.scheduled_at
        ).strftime("%d %B %Y, %I:%M %p")

        reason_label = valid_reasons[cancellation_reason]

        email_message = (
            f"Hello {candidate_name},\n\n"
            f"Your HR interview for "
            f"{interview.application.job.title} has been cancelled.\n\n"
            f"Original Interview Date: {interview_datetime}\n"
            f"Duration: {interview.duration} minutes\n"
            f"Cancellation Reason: {reason_label}\n"
        )

        if cancellation_note.strip():
            email_message += (
                f"Additional Details: {cancellation_note.strip()}\n"
            )

        email_message += (
            "\nWe apologize for any inconvenience caused.\n\n"
            "Regards,\n"
            "HireFlow Team"
        )

        HRInterviewService.send_hr_interview_email(
            recipient_email=interview.application.candidate.user.email,
            subject="HireFlow - HR Interview Cancelled",
            message=email_message,
        )


        return interview
    
    
    
    @staticmethod
    @transaction.atomic
    def submit_report(company, application_id, report_data):

        if not company:
            raise NotFound("Company profile not found.")

        interview = (
            HRInterview.objects
            .select_for_update()
            .filter(
                application__id=application_id,
                application__job__company=company,
            )
            .first()
        )

        if not interview:
            raise NotFound("HR interview not found.")

        if interview.status == HRInterview.InterviewStatus.COMPLETED:
            raise ValidationError(
                "HR interview report has already been submitted."
            )

        if interview.status != HRInterview.InterviewStatus.SCHEDULED:
            raise ValidationError(
                "Report can only be submitted for scheduled interviews."
            )

        interview.result = report_data["result"]
        interview.technical_skills_rating = (
            report_data["technical_skills_rating"]
        )
        interview.communication_rating = (
            report_data["communication_rating"]
        )
        interview.problem_solving_rating = (
            report_data["problem_solving_rating"]
        )
        interview.feedback = report_data["feedback"].strip()
        interview.additional_notes = (
            report_data.get("additional_notes", "").strip()
        )
        interview.status = HRInterview.InterviewStatus.COMPLETED

        interview.save(
            update_fields=[
                "result",
                "technical_skills_rating",
                "communication_rating",
                "problem_solving_rating",
                "feedback",
                "additional_notes",
                "status",
                "updated_at",
            ]
        )

        return interview
  
    
    
    
    
    
    @staticmethod
    def send_hr_interview_email(
        recipient_email,
        subject,
        message,
    ):
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
        except Exception:
            logger.exception(
                "Failed to send HR interview email to %s",
                recipient_email,
            )





    @staticmethod
    def generate_company_interview_token(
        company,
        interview_id,
        participant_identity,
        participant_name,
    ):
        if not company:
            raise NotFound("Company profile not found.")

        interview = HRInterviewRepository.get_interview_for_company(
            interview_id=interview_id,
            company=company,
        )

        if not interview:
            raise NotFound("HR interview not found.")

        if interview.status != HRInterview.InterviewStatus.SCHEDULED:
            raise ValidationError(
                "This interview is not available to join."
            )

        if timezone.now() < interview.scheduled_at:
            raise ValidationError(
                "Interview joining is not available yet."
            )

        livekit_url = os.getenv("LIVEKIT_URL")

        if not livekit_url:
            raise ValidationError(
                "LiveKit server URL is not configured."
            )

        room_name = f"hr-interview-{interview.id}"

        try:
            token = LiveKitService.generate_token(
                room_name=room_name,
                identity=participant_identity,
                participant_name=participant_name,
            )
        except ValueError as error:
            raise ValidationError(str(error))

        return {
            "token": token,
            "url": livekit_url,
            "room_name": room_name,
        }
