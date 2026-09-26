from datetime import timedelta

from django.utils import timezone

from company_app.models import AIInterview


class AIInterviewRepository:

    @staticmethod
    def create_interview(application, scheduled_at, duration):
        return AIInterview.objects.create(
            application=application,
            scheduled_at=scheduled_at,
            duration=duration,
        )

    @staticmethod
    def get_interview_by_application(application):
        return AIInterview.objects.filter(
            application=application
        ).first()

    @staticmethod
    def update_status(interview, status):
        interview.status = status
        interview.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )
        return interview

    @staticmethod
    def start_interview(interview):
        interview.status = AIInterview.InterviewStatus.IN_PROGRESS
        interview.started_at = timezone.now()

        interview.save(
            update_fields=[
                "status",
                "started_at",
                "updated_at",
            ]
        )

        return interview

    @staticmethod
    def has_candidate_schedule_conflict(
        candidate,
        scheduled_at,
        duration,
    ):
        new_start = scheduled_at
        new_end = scheduled_at + timedelta(minutes=duration)

        interviews = AIInterview.objects.filter(
            application__candidate=candidate,
            status__in=[
                AIInterview.InterviewStatus.SCHEDULED,
                AIInterview.InterviewStatus.IN_PROGRESS,
            ],
        )

        preparation_gap = timedelta(minutes=30)

        for interview in interviews:
            existing_start = interview.scheduled_at
            existing_end = (
                existing_start
                + timedelta(minutes=interview.duration)
            )

            blocked_start = existing_start - preparation_gap
            blocked_end = existing_end + preparation_gap

            if new_start < blocked_end and new_end > blocked_start:
                return True

        return False