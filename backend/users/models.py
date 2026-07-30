from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    class UserRole(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        COMPANY = "COMPANY", "Company"
        CANDIDATE = "CANDIDATE", "Candidate"

    email = models.EmailField(max_length=255,
                              unique=True)
    
    role = models.CharField( max_length=20,
                            choices=UserRole.choices,
                            default=UserRole.CANDIDATE )
    
    profile_completed = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email