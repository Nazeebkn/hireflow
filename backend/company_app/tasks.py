
from datetime import timedelta
import logging

from celery import shared_task
from django.db import transaction
from django.utils import timezone

from company_app.models import HRInterview


logger = logging.getLogger(__name__)


@shared_task
def process_hr_interview_no_shows():

    now = timezone.now()

    interview_ids = list(
        HRInterview.objects.filter(
            status=HRInterview.InterviewStatus.SCHEDULED,
            scheduled_at__lte=now - timedelta(minutes=6),
        ).values_list("id", flat=True)
    )

    missed_count = 0
    hr_no_show_count = 0

    for interview_id in interview_ids:

        with transaction.atomic():

            interview = (
                HRInterview.objects
                .select_for_update()
                .filter(
                    id=interview_id,
                    status=HRInterview.InterviewStatus.SCHEDULED,
                )
                .first()
            )

            if not interview:
                continue

            deadline = interview.scheduled_at + timedelta(
                minutes=5
            )

            if interview.candidate_joined_at is None or (
                interview.candidate_joined_at > deadline
            ):

                interview.status = (
                    HRInterview.InterviewStatus.MISSED
                )

                missed_count += 1

            elif (
                interview.company_joined_at is None
                or interview.company_joined_at > deadline
            ):

                interview.status = (
                    HRInterview.InterviewStatus.HR_NO_SHOW
                )

                hr_no_show_count += 1

            else:
                continue

            interview.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            logger.info(
                "HRInterview %s status updated to %s",
                interview.id,
                interview.status,
            )

    logger.info(
        "HR no-show check completed: MISSED=%s, HR_NO_SHOW=%s",
        missed_count,
        hr_no_show_count,
    )

    return {
        "missed": missed_count,
        "hr_no_show": hr_no_show_count,
    }
