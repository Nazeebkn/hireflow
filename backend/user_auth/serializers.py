from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from users.models import User



class SignupSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        required=True
    )

    password = serializers.CharField(
        write_only=True,
        required=True,
        trim_whitespace=False
    )

    role = serializers.ChoiceField(
        choices=User.UserRole.choices,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "role",
        ]

    def validate_email(self, value):

        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_password(self, value):

        if not value:
            raise serializers.ValidationError(
                "Password is required."
            )

        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )

        if len(value) > 128:
            raise serializers.ValidationError(
                "Password cannot exceed 128 characters."
            )

        if any(char.isspace() for char in value):
            raise serializers.ValidationError(
                "Password cannot contain spaces."
            )

        if not any(char.isupper() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not any(char.islower() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )

        if not any(
            char in '!@#$%^&*(),.?":{}|<>'
            for char in value
        ):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )

        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(
                list(exc.messages)
            )

        return value

    def validate_role(self, value):

        if value == User.UserRole.ADMIN:
            raise serializers.ValidationError(
                "Admin account cannot be created through signup."
            )

        return value
        
    

    
    

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)



    
    
class LogoutSerializer(serializers.Serializer):

    refresh = serializers.CharField()

    def validate(self, attrs):

        refresh_token = attrs["refresh"]

        token = RefreshToken(refresh_token)

        token.blacklist()

        return attrs
    
    
    
class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate(self, attrs):

        email = attrs["email"]

        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "No account found with this email."
            )

        return attrs  
    
    
class ResetPasswordSerializer(serializers.Serializer):

    uid = serializers.CharField()

    token = serializers.CharField()

    new_password = serializers.CharField(write_only=True)

    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):

        uid = attrs["uid"]
        token = attrs["token"]
        new_password = attrs["new_password"]
        confirm_password = attrs["confirm_password"]

        if new_password != confirm_password:
            raise serializers.ValidationError(
                "Passwords do not match."
            )

        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError(
                "Invalid user."
            )

        token_generator = PasswordResetTokenGenerator()

        if not token_generator.check_token(user, token):
            raise serializers.ValidationError(
                "Invalid or expired reset token."
            )

        attrs["user"] = user

        return attrs
    
    


class GoogleLoginSerializer(serializers.Serializer):

    token = serializers.CharField()

    def validate(self, attrs):

        token = attrs["token"]

        if not token:
            raise serializers.ValidationError(
                "Google token is required."
            )

        return attrs
    
    
    
class GoogleSignupSerializer(serializers.Serializer):

    token = serializers.CharField()

    role = serializers.ChoiceField(
        choices=User.UserRole.choices
    )

    def validate(self, attrs):

        if not attrs.get("token"):
            raise serializers.ValidationError(
                "Google token is required."
            )

        return attrs   
    
    
    
    
    
    
    
    
    