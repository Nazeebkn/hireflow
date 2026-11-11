
import re
import logging

from datetime import datetime, timezone as dt_timezone

from django.db import transaction, IntegrityError

from company_app.models import HRInterview
from core.models import LiveKitWebhookEvent


logger = logging.getLogger(__name__)


class LiveKitWebhookService:

    @staticmethod
    def process_event(event):
        event_type = event.event

        if event_type not in (
            "participant_joined",
            "participant_left",
        ):
            logger.info(
                "Ignoring LiveKit event: %s",
                event_type,
            )
            return

        if not event.room or not event.participant:
            logger.warning("Webhook missing room or participant.")
            return

        event_id = event.id

        if not event_id:
            logger.error("LiveKit webhook event has no ID.")
            return

        room_name = event.room.name
        participant_identity = event.participant.identity

        room_match = re.fullmatch(
            r"hr-interview-(\d+)",
            room_name,
        )

        if not room_match:
            logger.warning("Unknown LiveKit room: %s", room_name)
            return

        interview_id = int(room_match.group(1))

        if participant_identity.startswith("candidate-"):
            participant_type = "candidate"
        elif participant_identity.startswith("company-"):
            participant_type = "company"
        else:
            logger.warning(
                "Unknown participant identity: %s",
                participant_identity,
            )
            return

        event_timestamp = datetime.fromtimestamp(
            event.created_at,
            tz=dt_timezone.utc,
        )

        with transaction.atomic():

            interview = (
                HRInterview.objects
                .select_for_update()
                .filter(
                    id=interview_id,
                    status__in=[
                        HRInterview.InterviewStatus.SCHEDULED,
                        HRInterview.InterviewStatus.HR_NO_SHOW,
                    ],
                )
                .first()
            )

            if not interview:
                logger.warning(
                    "Active HRInterview not found: %s",
                    interview_id,
                )
                return

            try:
                with transaction.atomic():
                    LiveKitWebhookEvent.objects.create(
                        event_id=event_id,
                        event_type=event_type,
                        room_name=room_name,
                    )

            except IntegrityError:
                logger.info(
                    "Duplicate LiveKit event ignored: %s",
                    event_id,
                )
                return

            if participant_type == "candidate":
                joined_field = "candidate_joined_at"
                last_joined_field = "candidate_last_joined_at"
                left_field = "candidate_left_at"
            else:
                joined_field = "company_joined_at"
                last_joined_field = "company_last_joined_at"
                left_field = "company_left_at"

            if event_type == "participant_joined":

                first_joined = getattr(
                    interview,
                    joined_field,
                )

                last_joined = getattr(
                    interview,
                    last_joined_field,
                )

                if (
                    first_joined is None
                    or event_timestamp < first_joined
                ):
                    setattr(
                        interview,
                        joined_field,
                        event_timestamp,
                    )

                if (
                    last_joined is None
                    or event_timestamp > last_joined
                ):
                    setattr(
                        interview,
                        last_joined_field,
                        event_timestamp,
                    )

            elif event_type == "participant_left":

                last_left = getattr(
                    interview,
                    left_field,
                )

                if (
                    last_left is None
                    or event_timestamp > last_left
                ):
                    setattr(
                        interview,
                        left_field,
                        event_timestamp,
                    )

            interview.save(
                update_fields=[
                    joined_field,
                    last_joined_field,
                    left_field,
                    "updated_at",
                ]
            )

        logger.info(
            "HRInterview %s: %s %s processed. Event ID: %s",
            interview_id,
            participant_type,
            event_type,
            event_id,
        )
    