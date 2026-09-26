import json
import os
import base64

from google import genai
from rest_framework.exceptions import NotFound

from candidate_app.repositories.ai.resume_screening_repository import (
    ResumeScreeningRepository,
)

from candidate_app.services.ai.ai_interview_service import (
    AIInterviewService,
)

from candidate_app.models import Notification

from candidate_app.services.notification.notification_service import (
    NotificationService,
)


class ResumeScreeningService:

    @staticmethod
    def get_client():
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured."
            )

        return genai.Client(api_key=api_key)

    @staticmethod
    def screen_resume(application):
        client = ResumeScreeningService.get_client()

        job = application.job

        with application.submitted_resume.open("rb") as resume_file:
            resume_data = resume_file.read()

        prompt = f"""
You are an AI resume screening system for HireFlow.

Analyze the candidate's resume against the following job requirements.

JOB DETAILS:

Job Title:
{job.title}

Job Description:
{job.description}

Required Skills:
{job.skills}

Education:
{job.education}

Experience Required:
{job.experience_required}

Employment Type:
{job.employment_type}

Work Mode:
{job.work_mode}

Location:
{job.location}

Evaluate the candidate based only on the information available in the resume.

Return ONLY valid JSON in this exact structure:

{{
    "overall_score": 0,
    "skills_score": 0,
    "experience_score": 0,
    "education_score": 0,
    "recommendation": "SHORTLISTED",
    "summary": "",
    "strengths": [],
    "gaps": []
}}

Rules:

- All scores must be between 0 and 100.
- overall_score represents the overall match between the candidate and the job.
- skills_score evaluates the candidate's required skill match.
- experience_score evaluates relevant experience.
- education_score evaluates educational requirements.
- recommendation must be either "SHORTLISTED" or "REJECTED".
- Do not invent information that is not present in the resume.
- strengths must be an array of strings.
- gaps must be an array of strings.
"""

        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=[
                {
                    "type": "text",
                    "text": prompt,
                },
                {
                    "type": "document",
                    "data": base64.b64encode(
                        resume_data
                    ).decode("utf-8"),
                    "mime_type": "application/pdf",
                },
            ],
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": {
                    "type": "object",
                    "properties": {
                        "overall_score": {
                            "type": "integer"
                        },
                        "skills_score": {
                            "type": "integer"
                        },
                        "experience_score": {
                            "type": "integer"
                        },
                        "education_score": {
                            "type": "integer"
                        },
                        "recommendation": {
                            "type": "string",
                            "enum": [
                                "SHORTLISTED",
                                "REJECTED",
                            ],
                        },
                        "summary": {
                            "type": "string"
                        },
                        "strengths": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                        },
                        "gaps": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                        },
                    },
                    "required": [
                        "overall_score",
                        "skills_score",
                        "experience_score",
                        "education_score",
                        "recommendation",
                        "summary",
                        "strengths",
                        "gaps",
                    ],
                },
            },
        )

        result = interaction.output_text.strip()

        try:
            screening_result = json.loads(result)

        except json.JSONDecodeError:
            raise ValueError(
                "Gemini returned an invalid JSON response."
            )

        screening = ResumeScreeningRepository.create_screening(
            application=application,
            overall_score=screening_result["overall_score"],
            skills_score=screening_result["skills_score"],
            experience_score=screening_result["experience_score"],
            education_score=screening_result["education_score"],
            recommendation=screening_result["recommendation"],
            summary=screening_result["summary"],
            strengths=screening_result["strengths"],
            gaps=screening_result["gaps"],
        )

        if screening.recommendation == "SHORTLISTED":

            application_status = (
                application.ApplicationStatus.SHORTLISTED
            )

            ResumeScreeningRepository.update_application_status(
                application=application,
                status=application_status,
            )

            # Create shortlisted notification
            NotificationService.create_notification(
                user=application.candidate.user,
                notification_type=(
                    Notification.NotificationType
                    .RESUME_SCREENING_COMPLETED
                ),
                title="Resume Screening Completed",
                message=(
                    f"Your resume has been shortlisted for "
                    f"{application.job.title}."
                ),
            )

            # Automatically schedule AI interview
            AIInterviewService.schedule_interview(
                application
            )

        else:

            application_status = (
                application.ApplicationStatus.REJECTED
            )

            ResumeScreeningRepository.update_application_status(
                application=application,
                status=application_status,
            )

            # Create rejected notification
            NotificationService.create_notification(
                user=application.candidate.user,
                notification_type=(
                    Notification.NotificationType
                    .RESUME_SCREENING_COMPLETED
                ),
                title="Resume Screening Completed",
                message=(
                    f"Your application for "
                    f"{application.job.title} "
                    f"was not shortlisted."
                ),
            )

        return screening

    @staticmethod
    def get_screening(application):

        screening = (
            ResumeScreeningRepository
            .get_screening_by_application(
                application
            )
        )

        if not screening:
            raise NotFound(
                "Resume screening report not found."
            )

        return screening