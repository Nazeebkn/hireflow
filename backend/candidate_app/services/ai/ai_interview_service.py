import json
import threading
from datetime import datetime, timedelta, time

from django.utils import timezone
from rest_framework.exceptions import ValidationError

from candidate_app.repositories.ai.ai_interview_repository import (
    AIInterviewRepository,
)

from company_app.models import AIInterview

from candidate_app.models import Notification

from candidate_app.services.notification.notification_service import (
    NotificationService,
)

from candidate_app.repositories.ai.ai_interview_question_repository import (
    AIInterviewQuestionRepository,
)

from candidate_app.services.ai.gemini_service import GeminiService

from candidate_app.repositories.ai.ai_interview_answer_repository import (
    AIInterviewAnswerRepository,
)

from candidate_app.services.ai.speech_to_text_service import (
    SpeechToTextService,
)

from candidate_app.services.ai.piston_service import (
    execute_test_cases,
)


class AIInterviewService:

    INTERVIEW_DURATION = 30
    PREPARATION_GAP = 30
    START_GRACE_PERIOD = 5

    WORKING_START = time(9, 0)
    WORKING_END = time(17, 0)

    @staticmethod
    def schedule_interview(application):

        candidate = application.candidate

        if not candidate:
            raise ValidationError(
                "Candidate profile not found."
            )

        if application.status != application.ApplicationStatus.SHORTLISTED:
            raise ValidationError(
                "Only shortlisted candidates can be scheduled for an AI interview."
            )

        existing_interview = (
            AIInterviewRepository.get_interview_by_application(
                application
            )
        )

        if existing_interview:
            return existing_interview

        today = timezone.localdate()
        interview_date = today + timedelta(days=1)

        while True:

            slot_time = AIInterviewService.WORKING_START

            while slot_time < AIInterviewService.WORKING_END:

                scheduled_at = timezone.make_aware(
                    datetime.combine(
                        interview_date,
                        slot_time,
                    )
                )

                interview_end = (
                    scheduled_at
                    + timedelta(
                        minutes=AIInterviewService.INTERVIEW_DURATION
                    )
                )

                if interview_end.time() > AIInterviewService.WORKING_END:
                    break

                has_conflict = (
                    AIInterviewRepository.has_candidate_schedule_conflict(
                        candidate=candidate,
                        scheduled_at=scheduled_at,
                        duration=AIInterviewService.INTERVIEW_DURATION,
                    )
                )

                if not has_conflict:

                    interview = (
                        AIInterviewRepository.create_interview(
                            application=application,
                            scheduled_at=scheduled_at,
                            duration=AIInterviewService.INTERVIEW_DURATION,
                        )
                    )

                    from candidate_app.services.ai.ai_interview_task import (
                        generate_ai_interview_questions,
                    )

                    threading.Thread(
                        target=generate_ai_interview_questions,
                        args=(interview.id,),
                        daemon=True,
                    ).start()

                    NotificationService.create_notification(
                        user=application.candidate.user,
                        notification_type=(
                            Notification.NotificationType
                            .AI_INTERVIEW_SCHEDULED
                        ),
                        title="AI Interview Scheduled",
                        message=(
                            f"Your AI interview for "
                            f"{application.job.title} is scheduled for "
                            f"{timezone.localtime(scheduled_at).strftime('%d %B %Y at %I:%M %p')}."
                        ),
                    )

                    return interview

                slot_time = (
                    datetime.combine(
                        interview_date,
                        slot_time,
                    )
                    + timedelta(minutes=30)
                ).time()

            interview_date += timedelta(days=1)

    @staticmethod
    def start_interview(interview):

        if interview.status != interview.InterviewStatus.SCHEDULED:
            raise ValidationError(
                "This interview cannot be started."
            )

        current_time = timezone.now()

        latest_start_time = (
            interview.scheduled_at
            + timedelta(
                minutes=AIInterviewService.START_GRACE_PERIOD
            )
        )

        if current_time > latest_start_time:

            AIInterviewRepository.update_status(
                interview=interview,
                status=interview.InterviewStatus.MISSED,
            )

            raise ValidationError(
                "The interview start time has expired."
            )

        return AIInterviewRepository.start_interview(interview)

    @staticmethod
    def generate_questions(interview):

        existing_questions = (
            AIInterviewQuestionRepository.get_questions_by_interview(
                interview
            )
        )

        if existing_questions.exists():
            return existing_questions

        job = interview.application.job
        job_skills = job.skills

        prompt = f"""
    Generate a technical interview for a job with the following
    required skills:

    {job_skills}

    Important requirements:

    1. Cover the required skills in a balanced way.
    2. Do not generate questions for only one skill.
    3. For each question, specify which required skill it evaluates.
    4. Use THEORY questions for conceptual knowledge.
    5. Use CODING questions only when practical coding assessment
    is appropriate for the skill.
    6. For coding questions, specify the appropriate programming
    language.
    7. Framework or technology skills such as Django or Express.js
    do not always require coding questions. They can be assessed
    through theory, scenario, or practical-design questions.
    8. For SQL skills, coding questions may use SQL as the
    programming language.
    9. Do not use a programming language for theory questions.
    10. Generate a balanced technical interview covering the
        provided skills.

    Return ONLY valid JSON in this format:

    {{
        "questions": [
            {{
                "question_text": "What is Python?",
                "question_type": "THEORY",
                "difficulty": "EASY",
                "skill": "Python",
                "programming_language": null,
                "starter_code": null,
                "test_cases": []
            }},
            {{
                "question_text": "Write a Python function to reverse a string.",
                "question_type": "CODING",
                "difficulty": "MEDIUM",
                "skill": "Python",
                "programming_language": "python",
                "starter_code": "def reverse_string(s):\\n    pass",
                "test_cases": [
                    {{
                        "input": "hello",
                        "expected_output": "olleh"
                    }}
                ]
            }},
            {{
                "question_text": "Explain Django ORM.",
                "question_type": "THEORY",
                "difficulty": "MEDIUM",
                "skill": "Django",
                "programming_language": null,
                "starter_code": null,
                "test_cases": []
            }}
        ]
    }}
    """

        response = GeminiService.generate_text(prompt)

        try:
            data = json.loads(response)

        except json.JSONDecodeError:
            raise ValidationError(
                "Failed to process AI-generated interview questions."
            )

        questions = data.get("questions", [])

        if not questions:
            raise ValidationError(
                "No interview questions were generated."
            )

        created_questions = []

        for index, question in enumerate(
            questions,
            start=1,
        ):

            created_question = (
                AIInterviewQuestionRepository.create_question(
                    interview=interview,
                    question_text=question["question_text"],
                    question_type=question["question_type"],
                    difficulty=question["difficulty"],
                    question_order=index,
                    skill=question.get("skill"),
                    programming_language=question.get(
                        "programming_language"
                    ),
                    starter_code=question.get(
                        "starter_code"
                    ),
                    test_cases=question.get(
                        "test_cases",
                        [],
                    ),
                )
            )

            created_questions.append(created_question)

        return created_questions    
        
        
    @staticmethod
    def get_questions(interview):

        return AIInterviewQuestionRepository.get_questions_by_interview(
            interview
        )
        
        
    @staticmethod
    def submit_voice_answer(
        question,
        audio_recording,
        answer_text,
    ):
        if question.question_type != "THEORY":
            raise ValidationError(
                "This question does not accept a voice answer."
            )

        interview = question.interview

        if interview.status != AIInterview.InterviewStatus.IN_PROGRESS:
            raise ValidationError(
                "The interview is not currently in progress."
            )

        answer = AIInterviewAnswerRepository.get_answer_by_question(question)

        if not answer:
            answer = AIInterviewAnswerRepository.create_answer(question)

        answer = AIInterviewAnswerRepository.update_voice_answer(
            answer=answer,
            audio_recording=audio_recording,
        )

        transcript = SpeechToTextService.transcribe_audio(
            audio_recording
        )

        answer.answer_text = transcript
        answer.save(
            update_fields=["answer_text", "updated_at"]
        )
        
        answer = AIInterviewService.evaluate_theory_answer(
            question=question,
            answer=answer,
        )

        return answer
    
    
    
    
    @staticmethod
    def submit_coding_answer(question, submitted_code):
        if question.question_type != "CODING":
            raise ValidationError(
                "This question does not accept a coding answer."
            )

        interview = question.interview

        if interview.status != AIInterview.InterviewStatus.IN_PROGRESS:
            raise ValidationError(
                "The interview is not currently in progress."
            )

        if not submitted_code:
            raise ValidationError(
                "Code is required."
            )

        test_cases = question.test_cases or []

        if not test_cases:
            raise ValidationError(
                "No test cases are available for this coding question."
            )
        
        if not question.programming_language:
            raise ValidationError(
                "Programming language is not configured for this coding question."
            )

        results = execute_test_cases(
            code=submitted_code,
            test_cases=test_cases,
            language=question.programming_language,
        )

        answer = AIInterviewAnswerRepository.get_answer_by_question(
            question
        )

        if not answer:
            answer = AIInterviewAnswerRepository.create_answer(
                question
            )

        answer = AIInterviewAnswerRepository.update_coding_answer(
            answer=answer,
            submitted_code=submitted_code,
            test_results=results,
        )
                
        answer = AIInterviewService.evaluate_coding_answer(
            question=question,
            answer=answer,
        )

        return answer

    
    
    @staticmethod
    def calculate_coding_score(test_results):
        if not test_results:
            return 0

        passed_tests = sum(
            1
            for result in test_results
            if result.get("passed") is True
        )

        total_tests = len(test_results)

        return round((passed_tests / total_tests) * 100)
    
    
    
    @staticmethod
    def evaluate_theory_answer(question, answer):
        prompt = f"""
    Evaluate the candidate's answer to the following technical interview question.

    Question:
    {question.question_text}

    Candidate Answer:
    {answer.answer_text}

    Evaluation criteria:
    1. Technical correctness
    2. Relevance
    3. Completeness
    4. Clarity

    Give a score from 0 to 100.

    Return ONLY valid JSON in this exact format:

    {{
        "score": 85,
        "feedback": "Brief explanation of the evaluation."
    }}
    """

        response = GeminiService.generate_text(prompt)

        try:
            data = json.loads(response)
        except json.JSONDecodeError:
            raise ValidationError(
                "Failed to process AI answer evaluation."
            )

        score = data.get("score")
        feedback = data.get("feedback")

        if score is None or feedback is None:
            raise ValidationError(
                "Invalid AI evaluation response."
            )

        AIInterviewAnswerRepository.update_score(
            answer=answer,
            score=score,
            ai_feedback=feedback,
        )

        return answer
    
    
    
    
    
    @staticmethod
    def evaluate_coding_answer(question, answer):

        prompt = f"""
    Evaluate the candidate's coding answer for the following technical interview question.

    Question:
    {question.question_text}

    Programming Language:
    {question.programming_language}

    Candidate Code:
    {answer.submitted_code}

    Test Results:
    {json.dumps(answer.test_results)}

    Evaluation criteria:
    1. Correctness
    2. Code quality
    3. Approach
    4. Efficiency
    5. Handling of edge cases

    Give a score from 0 to 100.

    Return ONLY valid JSON in this exact format:

    {{
        "score": 85,
        "feedback": "Brief explanation of the evaluation."
    }}
    """

        response = GeminiService.generate_text(prompt)

        try:
            data = json.loads(response)

        except json.JSONDecodeError:
            raise ValidationError(
                "Failed to process AI coding evaluation."
            )

        score = data.get("score")
        feedback = data.get("feedback")

        if score is None or feedback is None:
            raise ValidationError(
                "Invalid AI coding evaluation response."
            )

        AIInterviewAnswerRepository.update_score(
            answer=answer,
            score=score,
            ai_feedback=feedback,
        )

        return answer