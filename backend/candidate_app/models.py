from django.db import models

from users.models import User


class CandidateProfile(models.Model):

    class Gender(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="candidate_profile"
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    phone_number = models.CharField(max_length=15)

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=Gender.choices
    )

    location = models.CharField(max_length=255)

    profile_picture = models.ImageField(
        upload_to="candidate/profile_pictures/",
        blank=True,
        null=True
    )

    headline = models.CharField(
        max_length=255,
        blank=True
    )

    about = models.TextField(
        blank=True
    )

    linkedin_url = models.URLField(
        blank=True
    )

    github_url = models.URLField(
        blank=True
    )

    portfolio_url = models.URLField(
        blank=True
    )

    resume = models.FileField(
        upload_to="candidate/resumes/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    
    
    
    
    
class CandidateEducation(models.Model):

    class EducationLevel(models.TextChoices):
        SSLC = "SSLC", "SSLC"
        HIGHER_SECONDARY = "HIGHER_SECONDARY", "Higher Secondary"
        DIPLOMA = "DIPLOMA", "Diploma"
        BACHELORS = "BACHELORS", "Bachelor's Degree"
        MASTERS = "MASTERS", "Master's Degree"
        DOCTORATE = "DOCTORATE", "Doctorate"
        CERTIFICATION = "CERTIFICATION", "Certification"

    candidate_profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="educations"
    )

    education_level = models.CharField(
        max_length=30,
        choices=EducationLevel.choices
    )

    institution_name = models.CharField(max_length=255)

    field_of_study = models.CharField(max_length=255)

    start_date = models.DateField()

    end_date = models.DateField()

    score = models.CharField(
        max_length=50,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.institution_name} - {self.education_level}"
    
    


class CandidateExperience(models.Model):

    candidate_profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="experiences"
    )

    company_name = models.CharField(max_length=255)

    job_title = models.CharField(max_length=255)

    employment_type = models.CharField(
        max_length=50,
        blank=True
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    start_date = models.DateField()

    end_date = models.DateField(
        null=True,
        blank=True
    )

    currently_working = models.BooleanField(default=False)

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"
    
    
    
    
class Skill(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class CandidateSkill(models.Model):

    class ProficiencyLevel(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"
        EXPERT = "EXPERT", "Expert"

    candidate_profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="skills"
    )

    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name="candidate_skills"
    )

    proficiency = models.CharField(
        max_length=20,
        choices=ProficiencyLevel.choices,
        default=ProficiencyLevel.BEGINNER
    )

    years_of_experience = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = (
            "candidate_profile",
            "skill",
        )
        
    def __str__(self):
        return f"{self.candidate_profile} - {self.skill}"
    
    
    
class CandidateJobPreference(models.Model):

    class EmploymentType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full Time"
        PART_TIME = "PART_TIME", "Part Time"
        CONTRACT = "CONTRACT", "Contract"
        INTERNSHIP = "INTERNSHIP", "Internship"
        FREELANCE = "FREELANCE", "Freelance"

    candidate_profile = models.OneToOneField(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="job_preference"
    )

    preferred_job_role = models.CharField(
        max_length=255
    )

    preferred_locations = models.JSONField(
    default=list
    )

    minimum_salary = models.PositiveIntegerField()

    maximum_salary = models.PositiveIntegerField()

    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices
    )

    remote_only = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.preferred_job_role