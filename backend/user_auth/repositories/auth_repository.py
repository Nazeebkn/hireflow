from users.models import User
from django.contrib.auth import authenticate

class AuthRepository:

    @staticmethod
    def create_user(validated_data):
        return User.objects.create_user(**validated_data)

    @staticmethod
    def get_user_by_email(email):
        return User.objects.get(email=email)

    @staticmethod
    def get_user_by_email_or_none(email):
        return User.objects.filter(email=email).first()

    @staticmethod
    def save_user(user):
        user.save()
        
    @staticmethod
    def authenticate_user(email, password):
        return authenticate(
            username=email,
            password=password
        )