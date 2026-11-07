
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


class HRInterviewService:

    @staticmethod
    @transaction.atomic
    def schedule_interview(
        company,
        application_id,
        scheduled_at,
        duration,
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

        if scheduled_at <= timezone.now():
            raise ValidationError(
                "Interview date and time must be in the future."
            )

        if duration <= 0:
            raise ValidationError(
                "Interview duration must be greater than zero."
            )

        interview = HRInterview.objects.filter(
            application=application
        ).first()

        if interview:
            if interview.status == HRInterview.InterviewStatus.COMPLETED:
                raise ValidationError(
                    "Completed HR interviews cannot be rescheduled."
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
            
        
        NotificationService.create_notification(
            user=application.candidate.user,
            notification_type=(
                Notification.NotificationType.HR_INTERVIEW_SCHEDULED
            ),
            title="HR Interview Scheduled",
            message=(
                f"Your HR interview for {application.job.title} "
                f"has been scheduled for "
                f"{interview.scheduled_at.strftime('%d %b %Y, %I:%M %p')}."
            ),
        )

        return interview
