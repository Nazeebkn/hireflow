from celery import shared_task
from company_app.models import AIInterview

from candidate_app.services.ai.ai_interview_service import (
    AIInterviewService,
)


@shared_task
def generate_ai_interview_questions(interview_id):

    try:
        interview = AIInterview.objects.get(
            id=interview_id
        )

        AIInterviewService.generate_questions(
            interview
        )

    except Exception as exc:

        print(
            f"AI interview question generation failed "
            f"for interview {interview_id}: {exc}"
        )