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