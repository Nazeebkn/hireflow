from django.utils import timezone

from candidate_app.models import AIInterviewAnswer


class AIInterviewAnswerRepository:

    @staticmethod
    def create_answer(question):
        return AIInterviewAnswer.objects.create(
            question=question,
        )

    @staticmethod
    def get_answer_by_question(question):
        return AIInterviewAnswer.objects.filter(
            question=question
        ).first()

    @staticmethod
    def get_answer_by_id(answer_id):
        return AIInterviewAnswer.objects.filter(
            id=answer_id
        ).first()

    @staticmethod
    def update_theory_answer(answer, answer_text):
        answer.answer_text = answer_text
        answer.submitted_at = timezone.now()

        answer.save(
            update_fields=[
                "answer_text",
                "submitted_at",
                "updated_at",
            ]
        )

        return answer


    @staticmethod
    def update_voice_answer(
        answer,
        audio_recording,
    ):
        answer.audio_recording = audio_recording
        answer.submitted_at = timezone.now()

        answer.save(
            update_fields=[
                "audio_recording",
                "submitted_at",
                "updated_at",
            ]
        )

        return answer


    @staticmethod
    def update_coding_answer(
        answer,
        submitted_code,
        test_results,
    ):
        answer.submitted_code = submitted_code
        answer.test_results = test_results
        answer.submitted_at = timezone.now()

        answer.save(
            update_fields=[
                "submitted_code",
                "test_results",
                "submitted_at",
                "updated_at",
            ]
        )   

        return answer

    @staticmethod
    def update_score(
        answer,
        score,
        ai_feedback=None,
    ):
        answer.score = score

        if ai_feedback is not None:
            answer.ai_feedback = ai_feedback

            update_fields = [
                "score",
                "ai_feedback",
                "updated_at",
            ]
        else:
            update_fields = [
                "score",
                "updated_at",
            ]

        answer.save(update_fields=update_fields)

        return answer

    @staticmethod
    def get_answers_by_interview(interview):
        return AIInterviewAnswer.objects.filter(
            question__interview=interview
        ).select_related("question")

    @staticmethod
    def get_submitted_answers_by_interview(interview):
        return AIInterviewAnswer.objects.filter(
            question__interview=interview,
            submitted_at__isnull=False,
        ).select_related("question")