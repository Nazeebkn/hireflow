import json
from datetime import datetime, time, timedelta

from django.utils import timezone
from rest_framework.exceptions import ValidationError

from candidate_app.models import Notification
from candidate_app.repositories.ai.ai_interview_answer_repository import (
    AIInterviewAnswerRepository,
)
from candidate_app.repositories.ai.ai_interview_question_repository import (
    AIInterviewQuestionRepository,
)
from candidate_app.repositories.ai.ai_interview_report_repository import (
    AIInterviewReportRepository,
)
from candidate_app.repositories.ai.ai_interview_repository import (
    AIInterviewRepository,
)
from candidate_app.services.ai.gemini_service import GeminiService
from candidate_app.services.ai.piston_service import (
    execute_test_cases,
)
from candidate_app.services.notification.notification_service import (
    NotificationService,
)
from company_app.models import AIInterview


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
                    
                    application.status = application.ApplicationStatus.AI_INTERVIEW
                    application.save(
                        update_fields=[
                            "status",
                            "updated_at",
                        ]
                    )


                    from candidate_app.services.ai.ai_interview_task import (
                        generate_ai_interview_questions,
                    )
                    generate_ai_interview_questions.delay(interview.id)
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
        if not AIInterviewQuestionRepository.get_question_count(interview):
            raise ValidationError(
                "Interview questions are still being prepared. Please try again shortly."
            )
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
    Generate a technical interview strictly based on the skills
    required by the job.
    JOB REQUIRED SKILLS:
    {job_skills}
    IMPORTANT RULES:
    1. Generate questions ONLY from the JOB REQUIRED SKILLS listed above.
    2. Do NOT introduce, assume, or invent any skill, technology,
    framework, database, or programming language that is NOT present
    in the JOB REQUIRED SKILLS.
    3. Cover the required skills in a balanced way.
    4. Do not generate questions for only one skill when multiple
    required skills are provided.
    5. Every question MUST have a "skill" field that matches one of
    the JOB REQUIRED SKILLS.
    6. Use THEORY questions for conceptual knowledge.
    7. Use CODING questions only when a practical coding assessment
    makes sense for that particular skill.
    8. For CODING questions, "programming_language" MUST identify the
    language required to solve the problem.
    9. Supported programming languages for coding questions are ONLY:
    - Python
    - JavaScript
    - SQL
    10. If Python is a required skill, Python coding questions may be
        generated.
    11. If JavaScript is a required skill, JavaScript coding questions
        may be generated.
    12. If SQL is a required skill, SQL coding questions may be generated.
    13. If SQL is NOT a required skill, do NOT generate SQL questions.
    14. If Python is NOT a required skill, do NOT generate Python
        coding questions.
    15. If JavaScript is NOT a required skill, do NOT generate
        JavaScript coding questions.
    16. Frameworks such as Django, Flask, Express.js, React, etc. can
        be assessed using THEORY, scenario, or practical-design
        questions. Do not automatically create coding questions for
        frameworks.
    17. A THEORY question must have:
        "programming_language": null
        "starter_code": null
        "test_cases": []
    18. A CODING question must have:
        - programming_language
        - starter_code
        - test_cases
    19. For coding questions, test_cases must contain valid input and
        expected_output values that can actually be executed using the
        selected programming language.
    20. Generate questions that can realistically be evaluated by an
        automated coding execution system.
    21. Do NOT generate coding questions that require:
        - GUI
        - browser interaction
        - external APIs
        - internet access
        - file uploads
        - databases other than SQL questions explicitly designed
        for SQL execution
        - user interaction during execution
    22. For Python coding questions, generate executable Python code.
    23. For JavaScript coding questions, generate executable
        JavaScript code using Node.js.
    24. For SQL coding questions, generate executable SQL questions
        only if SQL is listed as a required skill.
    25. The question must clearly describe what the candidate needs
        to implement or return.
    26. The generated coding question must be compatible with automated
        test-case evaluation.
    27. Do not generate vague coding questions such as:
        "Build a complete Django application"
        or
        "Create a full Express.js API".
    28. For framework skills, prefer questions such as:
        - Explain how Django ORM works.
        - How would you design an API using Express.js?
        - Explain middleware in Express.js.
        These can be THEORY questions.
    29. Return ONLY valid JSON.
    Return the response in exactly this structure:
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
                "starter_code": "def reverse_string(s):\\\\\n    pass",
                "test_cases": [
                    {{
                        "input": "hello",
                        "expected_output": "olleh"
                    }}
                ]
            }},
            {{
                "question_text": "Write a JavaScript function to reverse a string.",
                "question_type": "CODING",
                "difficulty": "MEDIUM",
                "skill": "JavaScript",
                "programming_language": "javascript",
                "starter_code": "function reverseString(s) {{\\\\\n    // Write your code here\\\\\n}}",
                "test_cases": [
                    {{
                        "input": "hello",
                        "expected_output": "olleh"
                    }}
                ]
            }},
            {{
                "question_text": "Write a SQL query to find employees with salary greater than 50000.",
                "question_type": "CODING",
                "difficulty": "MEDIUM",
                "skill": "SQL",
                "programming_language": "sql",
                "starter_code": null,
                "test_cases": [
                    {{
                        "input": "employees(id, name, salary)",
                        "expected_output": "SELECT name FROM employees WHERE salary > 50000;"
                    }}
                ]
            }}
        ]
    }}
    """
        print("AI TASK: BEFORE GEMINI", flush=True); response = GeminiService.generate_text(prompt); print("AI TASK: AFTER GEMINI", flush=True)
        try:
            data = json.loads(response)
        except json.JSONDecodeError:
            raise ValidationError(
                "Failed to process AI-generated interview questions."
            )
        print("AI TASK: JSON PARSED", flush=True)
        questions = data.get("questions", [])
        if not questions:
            raise ValidationError(
                "No interview questions were generated."
            )
        print("AI TASK: QUESTIONS COUNT:", len(questions), flush=True)
        created_questions = []
        print("AI TASK: BEFORE DB SAVE", flush=True)
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
        answer = AIInterviewAnswerRepository.get_answer_by_question(
            question
        )
        if not answer:
            answer = AIInterviewAnswerRepository.create_answer(
                question
            )
        answer = AIInterviewAnswerRepository.update_voice_answer(
            answer=answer,
            audio_recording=audio_recording,
        )
        # Send voice processing to Celery
        from candidate_app.services.ai.ai_interview_task import (
            process_voice_answer,
        )
        process_voice_answer.delay(answer.id)
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
        # ============================================================
        # CALCULATE EXECUTION SCORE
        # ============================================================
        execution_score = AIInterviewService.calculate_coding_score(
            results
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
            score=execution_score,  
        )
        # ============================================================
        # SAVE EXECUTION SCORE IMMEDIATELY
        # Gemini evaluation should NOT control this score
        # ============================================================
        answer = AIInterviewAnswerRepository.update_score(
            answer=answer,
            score=execution_score,
        )
        # ============================================================
        # BACKGROUND AI EVALUATION
        # ============================================================
        from candidate_app.services.ai.ai_interview_task import (
            process_coding_answer,
        )
        
        process_coding_answer.delay(answer.id)
        return answer
    
    
    
    @staticmethod
    def parse_ai_json(response):
        cleaned_response = response.strip()

        if cleaned_response.startswith("```"):
            cleaned_response = cleaned_response.replace(
                "```json", "", 1
            )
            cleaned_response = cleaned_response.replace(
                "```", "", 1
            )
            cleaned_response = cleaned_response.strip()

        try:
            return json.loads(cleaned_response)

        except json.JSONDecodeError:
            raise ValidationError(
                "Invalid JSON response from AI."
            )
    
    
    
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
        print("AI TASK: BEFORE GEMINI", flush=True); response = GeminiService.generate_text(prompt); print("AI TASK: AFTER GEMINI", flush=True)
        print("GEMINI RAW RESPONSE:")
        print(response)
       
        data = AIInterviewService.parse_ai_json(response)
       
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
    def evaluate_coding_answer(
        question,
        answer,
        execution_score,
    ):
        prompt = f"""
        Evaluate the candidate's coding answer for the following technical
        interview question.
        Question:
        {question.question_text}
        Programming Language:
        {question.programming_language}
        Candidate Code:
        {answer.submitted_code}
        Test Results:
        {json.dumps(answer.test_results)}
        Execution Score:
        {execution_score}
        The execution score is calculated from the automated test results.
        DO NOT change or override the execution score.
        Evaluate the candidate's code based on:
        1. Code quality
        2. Approach
        3. Efficiency
        4. Readability
        5. Edge-case handling
        6. Technical correctness
        Provide concise feedback explaining:
        - What the candidate did correctly
        - What could be improved
        - Any important technical issues
        Return ONLY valid JSON in this exact format:
        {{
        "feedback": "Brief explanation of the candidate's coding performance."
        }}
        """
        print("AI TASK: BEFORE GEMINI", flush=True); response = GeminiService.generate_text(prompt); print("AI TASK: AFTER GEMINI", flush=True)
        print("GEMINI CODING EVALUATION RESPONSE:")
        print(response)
        
            
        data = AIInterviewService.parse_ai_json(response)    
            
        feedback = data.get("feedback")
        if not feedback:
            raise ValidationError(
                "Invalid AI coding evaluation response."
            )
        AIInterviewAnswerRepository.update_score(
            answer=answer,
            score=execution_score,
            ai_feedback=feedback,
        )
        return answer
    
    
    
    
    
    @staticmethod
    def complete_interview(interview):
        if interview.status == AIInterview.InterviewStatus.COMPLETED:
            return interview

        if interview.status != AIInterview.InterviewStatus.IN_PROGRESS:
            raise ValidationError(
                "The interview is not currently in progress."
            )

        # Mark interview as completed
        interview.status = AIInterview.InterviewStatus.COMPLETED
        interview.completed_at = timezone.now()

        interview.save(
            update_fields=[
                "status",
                "completed_at",
                "updated_at",
            ]
        )

        # Generate interview report
        report = AIInterviewService.generate_interview_report(
            interview
        )

        application = interview.application
        job = application.job
        company_user = job.company.user

        # -------------------------------------------------
        # UPDATE APPLICATION STATUS
        # -------------------------------------------------

        if report.overall_score >= 80:

            application.status = (
                application.ApplicationStatus.SELECTED
            )

        else:

            application.status = (
                application.ApplicationStatus.REJECTED
            )

        application.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        # -------------------------------------------------
        # CANDIDATE NOTIFICATION - REPORT
        # -------------------------------------------------

        NotificationService.create_notification(
            user=application.candidate.user,
            notification_type=(
                Notification.NotificationType.AI_INTERVIEW_REPORT
            ),
            title="AI Interview Report Available",
            message=(
                f"Your AI interview report for "
                f"{job.title} is now available."
            ),
        )

        # -------------------------------------------------
        # COMPANY NOTIFICATION - INTERVIEW COMPLETED
        # -------------------------------------------------

        NotificationService.create_notification(
            user=company_user,
            notification_type=(
                Notification.NotificationType
                .COMPANY_AI_INTERVIEW_COMPLETED
            ),
            title="AI Interview Completed",
            message=(
                f"The AI interview for "
                f"{job.title} has been completed."
            ),
        )

        # -------------------------------------------------
        # COMPANY NOTIFICATION - SELECTED / REJECTED
        # -------------------------------------------------

        if report.overall_score >= 80:

            NotificationService.create_notification(
                user=company_user,
                notification_type=(
                    Notification.NotificationType
                    .CANDIDATE_SELECTED
                ),
                title="Candidate Selected",
                message=(
                    f"A candidate has been selected for "
                    f"{job.title} based on the AI interview result."
                ),
            )

        else:

            NotificationService.create_notification(
                user=company_user,
                notification_type=(
                    Notification.NotificationType
                    .CANDIDATE_REJECTED
                ),
                title="Candidate Rejected",
                message=(
                    f"A candidate has been rejected for "
                    f"{job.title} based on the AI interview result."
                ),
            )

        return interview, report
    
    
    
    @staticmethod
    def generate_interview_report(interview):
        questions = list(
            AIInterviewQuestionRepository
            .get_questions_by_interview(interview)
        )
        answers = list(
            AIInterviewAnswerRepository
            .get_answers_by_interview(interview)
        )
        total_questions = len(questions)
        answer_map = {
            answer.question_id: answer
            for answer in answers
        }
        answered_answers = [
            answer
            for answer in answers
            if answer.submitted_at is not None
        ]
        answered_questions = len(answered_answers)
        # -----------------------------------------
        # OVERALL SCORE
        # -----------------------------------------
        scores = [
            answer.score
            for answer in answered_answers
        ]
        overall_score = (
            round(sum(scores) / len(scores))
            if scores
            else 0
        )
        # -----------------------------------------
        # SKILL ANALYSIS
        # -----------------------------------------
        skill_data = {}
        for question in questions:
            answer = answer_map.get(question.id)
            if not answer or answer.submitted_at is None:
                continue
            skill = question.skill or "General"
            if skill not in skill_data:
                skill_data[skill] = {
                    "skill": skill,
                    "total_score": 0,
                    "question_count": 0,
                }
            skill_data[skill]["total_score"] += answer.score
            skill_data[skill]["question_count"] += 1
        skill_analysis = []
        for skill, data in skill_data.items():
            score = round(
                data["total_score"]
                / data["question_count"]
            )
            if score >= 80:
                level = "Strong"
            elif score >= 60:
                level = "Good"
            elif score >= 40:
                level = "Needs Improvement"
            else:
                level = "Weak"
            skill_analysis.append({
                "skill": skill,
                "score": score,
                "level": level,
            })
        # -----------------------------------------
        # STRENGTHS
        # -----------------------------------------
        strengths = [
            item["skill"]
            for item in skill_analysis
            if item["score"] >= 80
        ]
        # -----------------------------------------
        # AREAS TO IMPROVE
        # -----------------------------------------
        areas_to_improve = [
            item["skill"]
            for item in skill_analysis
            if item["score"] < 60
        ]
        # -----------------------------------------
        # RECOMMENDATION
        # -----------------------------------------
        if overall_score >= 80:
            recommendation = "STRONG"
        elif overall_score >= 60:
            recommendation = "GOOD"
        elif overall_score >= 40:
            recommendation = "NEEDS_IMPROVEMENT"
        else:
            recommendation = "WEAK"
        # -----------------------------------------
        # SUMMARY
        # -----------------------------------------
        summary = (
            f"The candidate completed the AI interview "
            f"with an overall score of {overall_score}%. "
            f"{answered_questions} out of "
            f"{total_questions} questions were answered."
        )
        # -----------------------------------------
        # CREATE OR UPDATE REPORT
        # -----------------------------------------
        report = (
            AIInterviewReportRepository
            .get_by_interview(interview)
        )
        if report:
            report = (
                AIInterviewReportRepository
                .update_report(
                    report=report,
                    overall_score=overall_score,
                    total_questions=total_questions,
                    answered_questions=answered_questions,
                    strengths=strengths,
                    areas_to_improve=areas_to_improve,
                    skill_analysis=skill_analysis,
                    recommendation=recommendation,
                    summary=summary,
                )
            )
        else:
            report = (
                AIInterviewReportRepository
                .create_report(
                    interview=interview,
                    overall_score=overall_score,
                    total_questions=total_questions,
                    answered_questions=answered_questions,
                    strengths=strengths,
                    areas_to_improve=areas_to_improve,
                    skill_analysis=skill_analysis,
                    recommendation=recommendation,
                    summary=summary,
                )
            )
        return report
