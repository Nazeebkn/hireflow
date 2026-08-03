from django.urls import path

from company_app.views.profile.company_view import CompanyAPIView

urlpatterns = [
    path(
        "profile/",
        CompanyAPIView.as_view(),
        name="company-profile",
    ),
]