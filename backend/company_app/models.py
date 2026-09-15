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

    website = models.URLField(blank=True, null=True)

    description = models.TextField()

    contact_person = models.CharField(max_length=255)

    contact_phone = models.CharField(max_length=20)

    country = models.CharField(max_length=100)

    state = models.CharField(max_length=100)

    city = models.CharField(max_length=100)

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

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

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
        AI_INTERVIEW = "AI_INTERVIEW", "AI Interview"
        CLASSIFIED = "CLASSIFIED", "Classified"
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

    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("candidate", "job")
        ordering = ["-applied_at"]