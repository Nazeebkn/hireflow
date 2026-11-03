from celery import shared_task

from candidate_app.models import AIInterviewAnswer
from candidate_app.repositories.ai.ai_interview_answer_repository import (
    AIInterviewAnswerRepository,
)
from candidate_app.services.ai.ai_interview_service import (
    AIInterviewService,
)
from candidate_app.services.ai.speech_to_text_service import (
    SpeechToTextService,
)
from company_app.models import AIInterview


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=60,
    retry_kwargs={"max_retries": 3},
)
def generate_ai_interview_questions(self, interview_id):

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

        raise


@shared_task
def process_voice_answer(answer_id):

    try:
        answer = (
            AIInterviewAnswer.objects
            .select_related("question")
            .get(id=answer_id)
        )

        # 1. Convert audio to text
        transcript = SpeechToTextService.transcribe_audio(
            answer.audio_recording
        )

        # 2. Save transcript
        answer.answer_text = transcript

        answer.save(
            update_fields=[
                "answer_text",
                "updated_at",
            ]
        )

        # 3. Evaluate answer using Gemini
        AIInterviewService.evaluate_theory_answer(
            question=answer.question,
            answer=answer,
        )

    except AIInterviewAnswer.DoesNotExist:

        print(
            f"AI interview answer {answer_id} not found."
        )

    except Exception as exc:

        print(
            f"Voice answer processing failed "
            f"for answer {answer_id}: {exc}"
        )
        
        
@shared_task
def process_coding_answer(answer_id):
    try:
        answer = (
            AIInterviewAnswer.objects
            .select_related("question")
            .get(id=answer_id)
        )

        # ============================================================
        # USE SAVED EXECUTION SCORE
        # ============================================================
        execution_score = answer.score  # <<< CHANGED

        # ============================================================
        # GEMINI AI EVALUATION
        # ============================================================
        AIInterviewAnswerRepository.update_score(
            answer=answer,
            score=execution_score,
            ai_feedback=(
                "Coding answer evaluated based on "
                "automated test results."
            ),
        )
        

    except AIInterviewAnswer.DoesNotExist:

        print(
            f"AI interview answer {answer_id} not found."
        )

    except Exception as exc:

        print(
            f"Coding answer processing failed "
            f"for answer {answer_id}: {exc}"
        )