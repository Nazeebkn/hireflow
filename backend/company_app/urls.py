from django.urls import path

from company_app.views.profile.company_view import CompanyAPIView
from company_app.views.job.job_views import (
    JobCreateAPIView,
    JobUpdateAPIView,
    JobPublishAPIView,
    JobCloseAPIView,
)
from company_app.views.dashboard.dashboard_views import (
    CompanyDashboardAPIView,
)


from company_app.views.job_application.company_job_application_views import (
    CompanyJobApplicationsAPIView,
    CompanyApplicationDetailAPIView,
)

urlpatterns = [

    path(
        "profile/",
        CompanyAPIView.as_view(),
        name="company-profile",
    ),

    path(
        "jobs/",
        JobCreateAPIView.as_view(),
        name="job-create",
    ),

    path(
        "jobs/<int:job_id>/",
        JobUpdateAPIView.as_view(),
        name="job-update",
    ),
    
    path(
    "jobs/<int:job_id>/publish/",
    JobPublishAPIView.as_view(),
    name="job-publish",
    ),

    path(
        "jobs/<int:job_id>/close/",
        JobCloseAPIView.as_view(),
        name="job-close",
    ),
    
    path(
    "dashboard/",
    CompanyDashboardAPIView.as_view(),
    name="company-dashboard",
    ),

    path(
    "jobs/<int:job_id>/applications/",
    CompanyJobApplicationsAPIView.as_view(),
    name="company-job-applications",
    ),
    

    
    path(
    "applications/<int:application_id>/",
    CompanyApplicationDetailAPIView.as_view(),
    name="company-application-detail",
),   
    

]