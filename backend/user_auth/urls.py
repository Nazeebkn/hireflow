from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ForgotPasswordAPIView,
    GoogleLoginAPIView,
    GoogleSignupAPIView,
    LoginAPIView,
    LogoutAPIView,
    ProfileAPIView,
    ResetPasswordAPIView,
    SignupAPIView,
    VerifyEmailAPIView,
)

urlpatterns = [
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    
    path(
        "verify-email/<uid>/<token>/",
        VerifyEmailAPIView.as_view(),
        name="verify-email",
    ),
    
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path("forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password",), 
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("google-login/", GoogleLoginAPIView.as_view(), name="google-login"),
    path("google-signup/", GoogleSignupAPIView.as_view(), name="google-signup"),
]




