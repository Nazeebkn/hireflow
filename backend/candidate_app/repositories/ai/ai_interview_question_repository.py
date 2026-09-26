from company_app.models import AIInterview
from candidate_app.models import AIInterviewQuestion


class AIInterviewQuestionRepository:

    @staticmethod
    def create_question(
        interview,
        question_text,
        question_type,
        difficulty,
        question_order,
        skill=None,
        programming_language=None,
        starter_code=None,
        test_cases=None,
    ):
        return AIInterviewQuestion.objects.create(
            interview=interview,
            question_text=question_text,
            question_type=question_type,
            difficulty=difficulty,
            question_order=question_order,
            skill=skill,
            programming_language=programming_language,
            starter_code=starter_code,
            test_cases=test_cases or [],
        )

    @staticmethod
    def get_question_by_id(question_id):
        return AIInterviewQuestion.objects.filter(
            id=question_id
        ).first()

    @staticmethod
    def get_questions_by_interview(interview):
        return AIInterviewQuestion.objects.filter(
            interview=interview
        ).order_by("question_order")

    @staticmethod
    def get_question_by_order(interview, question_order):
        return AIInterviewQuestion.objects.filter(
            interview=interview,
            question_order=question_order,
        ).first()

    @staticmethod
    def get_next_question(interview, current_order):
        return (
            AIInterviewQuestion.objects
            .filter(
                interview=interview,
                question_order__gt=current_order,
            )
            .order_by("question_order")
            .first()
        )

    @staticmethod
    def get_first_question(interview):
        return (
            AIInterviewQuestion.objects
            .filter(interview=interview)
            .order_by("question_order")
            .first()
        )

    @staticmethod
    def get_question_count(interview):
        return AIInterviewQuestion.objects.filter(
            interview=interview
        ).count()

    @staticmethod
    def delete_questions_by_interview(interview):
        return AIInterviewQuestion.objects.filter(
            interview=interview
        ).delete()
        
  