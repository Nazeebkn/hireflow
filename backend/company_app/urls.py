from django.urls import path

from company_app.views.dashboard.dashboard_views import (
    CompanyDashboardAPIView,
)
from company_app.views.job.job_views import (
    JobCloseAPIView,
    JobCreateAPIView,
    JobPublishAPIView,
    JobUpdateAPIView,
)
from company_app.views.job_application.company_job_application_views import (
    CompanyApplicationDetailAPIView,
    CompanyJobApplicationsAPIView,
    CompanyAIInterviewReportAPIView,
)
from company_app.views.profile.company_view import CompanyAPIView

from company_app.views.notification.notification_views import (
    CompanyNotificationListAPIView,
    CompanyNotificationReadAPIView,
    CompanyNotificationMarkAllReadAPIView,
    CompanyNotificationUnreadCountAPIView,
    CompanyNotificationClearAllAPIView,
    CompanyNotificationDeleteAPIView,
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
    
    
        path(
        "notifications/",
        CompanyNotificationListAPIView.as_view(),
        name="company-notifications",
    ),

    path(
        "notifications/unread-count/",
        CompanyNotificationUnreadCountAPIView.as_view(),
        name="company-notifications-unread-count",
    ),

    path(
        "notifications/read-all/",
        CompanyNotificationMarkAllReadAPIView.as_view(),
        name="company-notifications-read-all",
    ),

    path(
        "notifications/<int:notification_id>/read/",
        CompanyNotificationReadAPIView.as_view(),
        name="company-notification-read",
    ),

    path(
        "notifications/clear-all/",
        CompanyNotificationClearAllAPIView.as_view(),
        name="company-notifications-clear-all",
    ),

    path(
        "notifications/<int:notification_id>/delete/",
        CompanyNotificationDeleteAPIView.as_view(),
        name="company-notification-delete",
    ),
    
    path(
    "applications/<int:application_id>/ai-interview-report/",
    CompanyAIInterviewReportAPIView.as_view(),
    name="company-ai-interview-report",
),
]