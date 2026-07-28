from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from user_auth.repositories.auth_repository import AuthRepository

class AuthService:

    @staticmethod
    def forgot_password(email):

        user = AuthRepository.get_user_by_email(email)

        token_generator = PasswordResetTokenGenerator()

        token = token_generator.make_token(user)

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = (
            f"http://localhost:3000/reset-password/?uid={uid}&token={token}"
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
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
            }
        }