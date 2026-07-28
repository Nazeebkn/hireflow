from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.core.mail import send_mail
from django.conf import settings

from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str

from google.auth.transport import requests
from google.oauth2 import id_token

from .models import User
from .serializers import SignupSerializer, LoginSerializer, LogoutSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from .serializers import GoogleLoginSerializer

class SignupAPIView(APIView):
    
    def post(self, request):
        serializer = SignupSerializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(
                {"message": "Account created successfully"},
                status=status.HTTP_201_CREATED
            )
            
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        

class LoginAPIView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            return Response(
                serializer.validated_data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
        
class ProfileAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            "email": request.user.email,
            "role": request.user.role,
        })
        
        
        
class LogoutAPIView(APIView):

    def post(self, request):

        serializer = LogoutSerializer(data=request.data)

        if serializer.is_valid():

            return Response(
                {"message": "Logout successful."},
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
        
class ForgotPasswordAPIView(APIView):

    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)

        if serializer.is_valid():
            
            email = serializer.validated_data["email"]
            
            user = User.objects.get(email=email)
            
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
                )

            return Response(
                {
                    "message": "Password reset link sent successfully."
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
        

class ResetPasswordAPIView(APIView):

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            
            user = serializer.validated_data["user"]

            user.set_password(serializer.validated_data["new_password"])
            
            user.save()

            return Response(
                {
                    "message": "Password changed successfully."
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
        


class GoogleLoginAPIView(APIView):

    def post(self, request):

        serializer = GoogleLoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]

        try:
            id_info = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except ValueError:
            return Response(
                {"error": "Invalid Google token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        if not id_info.get("email_verified"):
            return Response(
                {"error": "Google email is not verified."},
                status=status.HTTP_400_BAD_REQUEST,
    )
            
        email = id_info["email"]
     
        
        user = User.objects.filter(email=email).first()
        
        if not user:
            user = User.objects.create_user(
                email=email,
                role=User.UserRole.CANDIDATE,
            )
        
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Google login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "role": user.role,
                }
            },
            status=status.HTTP_200_OK,
        )