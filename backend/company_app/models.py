from django.db import models

from users.models import User


class ApprovalStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class Company(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="company_profile"
    )

    company_name = models.CharField(max_length=255)

    industry = models.CharField(max_length=150)

    company_size = models.CharField(max_length=50)

    website = models.URLField(
        blank=True,
        null=True
    )

    description = models.TextField()

    contact_person = models.CharField(
        max_length=255
    )

    contact_phone = models.CharField(
        max_length=20
    )

    country = models.CharField(
        max_length=100
    )

    state = models.CharField(
        max_length=100
    )

    city = models.CharField(
        max_length=100
    )

    address = models.TextField()

    company_logo = models.ImageField(
        upload_to="company/logos/",
        blank=True,
        null=True
    )

    verification_document = models.FileField(
        upload_to="company/documents/"
    )

    approval_status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING
    )

    rejection_reason = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.company_name


class Job(models.Model):

    class EmploymentType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full Time"
        PART_TIME = "PART_TIME", "Part Time"
        CONTRACT = "CONTRACT", "Contract"
        INTERNSHIP = "INTERNSHIP", "Internship"
        FREELANCE = "FREELANCE", "Freelance"

    class JobStatus(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        CLOSED = "CLOSED", "Closed"

    class WorkMode(models.TextChoices):
        ONSITE = "ONSITE", "On-site"
        REMOTE = "REMOTE", "Remote"
        HYBRID = "HYBRID", "Hybrid"

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField()

    location = models.CharField(
        max_length=255
    )

    work_mode = models.CharField(
        max_length=20,
        choices=WorkMode.choices,
        default=WorkMode.ONSITE
    )

    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices
    )

    skills = models.TextField(
        blank=True
    )

    education = models.CharField(
        max_length=255,
        blank=True
    )

    position = models.CharField(
        max_length=255,
        blank=True
    )

    minimum_salary = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    maximum_salary = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    experience_required = models.CharField(
        max_length=100,
        blank=True
    )

    application_deadline = models.DateField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=JobStatus.choices,
        default=JobStatus.DRAFT
    )

    published_at = models.DateTimeField(
        null=True,
        blank=True
    )

    closed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title


class JobApplication(models.Model):

    class ApplicationStatus(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        RESUME_SCREENING = "RESUME_SCREENING", "Resume Screening"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        AI_INTERVIEW = "AI_INTERVIEW", "AI Interview"
        SELECTED = "SELECTED", "Selected"
        FINAL_INTERVIEW = "FINAL_INTERVIEW", "Final Interview"
        HIRED = "HIRED", "Hired"
        REJECTED = "REJECTED", "Rejected"

    candidate = models.ForeignKey(
        "candidate_app.CandidateProfile",
        on_delete=models.CASCADE,
        related_name="job_applications",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    submitted_resume = models.FileField(
        upload_to="candidate/application_resumes/",
    )

    status = models.CharField(
        max_length=30,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
    )

    resume_screening_error = models.CharField(
        max_length=20,
        choices=[
            ("QUOTA_ERROR", "Quota error"),
            ("OTHER_ERROR", "Other error"),
        ],
        blank=True,
        null=True,
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = ("candidate", "job")
        ordering = ["-applied_at"]

    def __str__(self):
        return f"{self.candidate} - {self.job}"


class AIResumeScreening(models.Model):

    application = models.OneToOneField(
        JobApplication,
        on_delete=models.CASCADE,
        related_name="resume_screening"
    )

    overall_score = models.PositiveIntegerField()

    skills_score = models.PositiveIntegerField()

    experience_score = models.PositiveIntegerField()

    education_score = models.PositiveIntegerField()

    recommendation = models.CharField(
        max_length=30
    )

    summary = models.TextField()

    strengths = models.JSONField(
        default=list
    )

    gaps = models.JSONField(
        default=list
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"Resume Screening - "
            f"Application {self.application.id}"
        )
        
        
        
        

class AIInterview(models.Model):

    class InterviewStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"
        MISSED = "MISSED", "Missed"
        CANCELLED = "CANCELLED", "Cancelled"

    application = models.OneToOneField(
        JobApplication,
        on_delete=models.CASCADE,
        related_name="ai_interview",
    )

    scheduled_at = models.DateTimeField()

    duration = models.PositiveIntegerField(
        help_text="Interview duration in minutes"
    )

    status = models.CharField(
        max_length=20,
        choices=InterviewStatus.choices,
        default=InterviewStatus.SCHEDULED,
    )

    started_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Interview - Application {self.application_id}"
    
        
    
    
    
class JobQuestion(models.Model):

    class QuestionType(models.TextChoices):
        SHORT_TEXT = "SHORT_TEXT", "Short Text"
        YES_NO = "YES_NO", "Yes / No"
        NUMBER = "NUMBER", "Number"
        MULTIPLE_CHOICE = "MULTIPLE_CHOICE", "Multiple Choice"

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    question_text = models.CharField(max_length=500)

    question_type = models.CharField(
        max_length=20,
        choices=QuestionType.choices,
    )

    options = models.JSONField(default=list, blank=True)

    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.job.title} - {self.question_text}"







class ApplicationAnswer(models.Model):

    application = models.ForeignKey(
        JobApplication,
        on_delete=models.CASCADE,
        related_name="answers",
    )

    question = models.ForeignKey(
        JobQuestion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="submitted_answers",
    )

    question_text_snapshot = models.CharField(max_length=500)

    question_type_snapshot = models.CharField(max_length=20)

    options_snapshot = models.JSONField(default=list, blank=True)

    answer = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=["application", "question"],
                name="unique_application_question_answer",
            )
        ]

    def __str__(self):
        return f"Answer for Application {self.application_id}"
    
    
    
    
    
class HRInterview(models.Model):

    class InterviewStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
        MISSED = "MISSED", "Missed"
        
    class ReportStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUBMITTED = "SUBMITTED", "Submitted"

    class InterviewResult(models.TextChoices):
        HIRED = "HIRED", "Hired"
        REJECTED = "REJECTED", "Rejected"

    application = models.OneToOneField(
        JobApplication,
        on_delete=models.CASCADE,
        related_name="hr_interview",
    )

    scheduled_at = models.DateTimeField()

    duration = models.PositiveIntegerField(
        help_text="Interview duration in minutes"
    )

    status = models.CharField(
        max_length=20,
        choices=InterviewStatus.choices,
        default=InterviewStatus.SCHEDULED,
    )
    
    report_status = models.CharField(
        max_length=20,
        choices=ReportStatus.choices,
        default=ReportStatus.PENDING,
    )


    result = models.CharField(
        max_length=20,
        choices=InterviewResult.choices,
        blank=True,
        null=True,
    )

    feedback = models.TextField(
        blank=True,
        null=True,
    )
    
    technical_skills_rating = models.PositiveSmallIntegerField(
    blank=True,
    null=True,
    )

    communication_rating = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
    )

    problem_solving_rating = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
    )

    additional_notes = models.TextField(
        blank=True,
        null=True,
    )
    
    class RescheduleReason(models.TextChoices):
        INTERVIEWER_UNAVAILABLE = (
            "INTERVIEWER_UNAVAILABLE",
            "Interviewer Unavailable",
        )
        TECHNICAL_ISSUES = "TECHNICAL_ISSUES", "Technical Issues"
        COMPANY_SCHEDULING_CONFLICT = (
            "COMPANY_SCHEDULING_CONFLICT",
            "Company Scheduling Conflict",
        )
        INTERNAL_OPERATIONAL_ISSUE = (
            "INTERNAL_OPERATIONAL_ISSUE",
            "Internal Operational Issue",
        )
        OTHER = "OTHER", "Other"

    class CancellationReason(models.TextChoices):
        JOB_POSITION_CLOSED = "JOB_POSITION_CLOSED", "Job Position Closed"
        HIRING_PROCESS_STOPPED = (
            "HIRING_PROCESS_STOPPED",
            "Hiring Process Stopped",
        )
        COMPANY_DECIDED_NOT_TO_PROCEED = (
            "COMPANY_DECIDED_NOT_TO_PROCEED",
            "Company Decided Not to Proceed",
        )
        POSITION_FILLED = "POSITION_FILLED", "Position Filled"
        DUPLICATE_INTERVIEW = "DUPLICATE_INTERVIEW", "Duplicate Interview"
        OTHER = "OTHER", "Other"

    cancellation_reason = models.CharField(
        max_length=30,
        choices=CancellationReason.choices,
        blank=True,
        null=True,
    )

    cancellation_note = models.TextField(
        blank=True,
        null=True,
    )

    cancelled_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"HR Interview - Application {self.application_id}"



