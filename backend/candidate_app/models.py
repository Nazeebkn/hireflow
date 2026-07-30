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