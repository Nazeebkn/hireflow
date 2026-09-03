from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from company_app.models import Company

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from user_auth.repositories.auth_repository import AuthRepository
from users.models import User

class AuthService:

    @staticmethod
    def forgot_password(email):

        try:
            user = AuthRepository.get_user_by_email(email)

        except User.DoesNotExist:
            raise serializers.ValidationError({
                "message": "No account found with this email."
            })

        token_generator = PasswordResetTokenGenerator()

        token = token_generator.make_token(user)

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        )

        send_mail(
            subject="Reset Your Password",
            message=f"""
            Click the link below to reset your password:

            {reset_link}

            This password reset link will expire in 30 minutes.

            If you did not request a password reset, please ignore this email.
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        
        
        
    @staticmethod
    def reset_password(user, new_password):

        user.set_password(new_password)
        AuthRepository.save_user(user)
        
        
        
            
    @staticmethod
    def signup(validated_data):

        user = AuthRepository.create_user(validated_data)

        token = default_token_generator.make_token(user)

        return user, token
        
        
    
    @staticmethod
    def login(validated_data):

        email = validated_data["email"]
        password = validated_data["password"]

        db_user = AuthRepository.get_user_by_email_or_none(email)

        if not db_user:
            raise serializers.ValidationError({
                "message": "Invalid email or password."
            })

        if not db_user.is_active:
            raise serializers.ValidationError({
                "message": "Your account has been suspended. Please contact the administrator."
            })

        if (
            db_user.role != User.UserRole.ADMIN
            and not db_user.is_staff
            and not db_user.is_superuser
            and not db_user.email_verified
        ):
            raise serializers.ValidationError({
                "message": "Please verify your email before logging in."
            })

        user = AuthRepository.authenticate_user(
            email,
            password
        )

        if not user:
            raise serializers.ValidationError({
                "message": "Invalid email or password."
            })

        refresh = RefreshToken.for_user(user)

        profile_completed = user.profile_completed
        approval_status = None

        if user.role == "COMPANY":

            company = Company.objects.filter(
                user=user
            ).first()

            if company:
                approval_status = company.approval_status

        return {
            "message": "Login successful.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "profile_completed": profile_completed,
                "approval_status": approval_status,
            }
        }
        
        
    @staticmethod
    def verify_google_token(token):

        try:
            id_info = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except ValueError:
            raise serializers.ValidationError(
                {"token": ["Invalid Google token."]}
            )

        if not id_info.get("email_verified"):
            raise serializers.ValidationError(
                {"token": ["Google email is not verified."]}
            )

        return id_info
        
        
        
    @staticmethod
    def google_signup(token, role):

        id_info = AuthService.verify_google_token(token)

        email = id_info["email"]

        user = AuthRepository.get_user_by_email_or_none(email)

        if user:
            raise serializers.ValidationError({
                "message": "Account already exists. Please login."
            })

        user = AuthRepository.create_google_user(
            email,
            role,
        )

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
            },
        }
            
        
    @staticmethod
    def google_login(token):

        id_info = AuthService.verify_google_token(token)

        email = id_info["email"]

        user = AuthRepository.get_user_by_email_or_none(email)

        if not user:
            raise serializers.ValidationError({
                "message": "Account not found. Please sign up using Google first."
            })

        refresh = RefreshToken.for_user(user)

        approval_status = None

        if user.role == User.UserRole.COMPANY:

            company = Company.objects.filter(
                user=user
            ).first()

            if company:
                approval_status = company.approval_status

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "profile_completed": user.profile_completed,
                "approval_status": approval_status,
            },
        }
        
        
        
    @staticmethod
    def verify_email(uid, token):

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = AuthRepository.get_user_by_id(user_id)

        except (TypeError, ValueError, OverflowError):
            raise serializers.ValidationError(
                {"message": "Invalid verification link."}
            )

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError(
                {"message": "Invalid or expired verification link."}
            )

        user.email_verified = True
        AuthRepository.save_user(user)

        return user