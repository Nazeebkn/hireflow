from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str


from users.models import User


class SignupSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'role'
        ]
        
    

    
    

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
        except Exception:
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
    
    
    
    
    
    
    
    
    
    
    
    
    