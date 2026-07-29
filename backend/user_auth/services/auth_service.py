from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests

from user_auth.repositories.auth_repository import AuthRepository
from users.models import User

class AuthService:

    @staticmethod
    def forgot_password(email):

        try:
            user = AuthRepository.get_user_by_email(email)

        except User.DoesNotExist:
            raise serializers.ValidationError({
                "email": ["User with this email does not exist."]
            })

        token_generator = PasswordResetTokenGenerator()

        token = token_generator.make_token(user)

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = (
            f"http://localhost:5173/reset-password/{uid}/{token}"
        )

        send_mail(
            subject="Reset Your Password",
            message=f"Click the link below to reset your password.\n\n{reset_link}",
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

        return AuthRepository.create_user(validated_data)
        
        
    
    @staticmethod
    def login(validated_data):

        email = validated_data["email"]
        password = validated_data["password"]

        user = AuthRepository.authenticate_user(
            email,
            password
        )
        
        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        refresh = RefreshToken.for_user(user)

        return {
            "message": "Login successful.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
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
            raise serializers.ValidationError(
                "Account already exists. Please login."
            )

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
            raise serializers.ValidationError(
                "Account not found. Please sign up using Google first."
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