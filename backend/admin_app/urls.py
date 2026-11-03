from django.urls import path

from admin_app.views.admin.approve_company_view import (
    ApproveCompanyAPIView,
)
from admin_app.views.admin.candidate_applications_view import (
    CandidateApplicationsAPIView,
)
from admin_app.views.admin.candidate_details_view import (
    CandidateDetailsAPIView,
)
from admin_app.views.admin.candidate_list_view import (
    CandidateListAPIView,
)
from admin_app.views.admin.company_details_view import (
    CompanyDetailsAPIView,
)
from admin_app.views.admin.company_list_view import (
    CompanyListAPIView,
)
from admin_app.views.admin.pending_company_view import (
    PendingCompanyListAPIView,
)
from admin_app.views.admin.reject_company_view import (
    RejectCompanyAPIView,
)
from admin_app.views.admin.user_status_view import (
    UserStatusAPIView,
)

from admin_app.views.admin.active_jobs_views import (
    ActiveJobsCountAPIView,
)

from admin_app.views.company.company_job_details_view import (
    CompanyJobDetailsAPIView,
)

from admin_app.views.notification.notification_views import (
    AdminNotificationListAPIView,
    AdminNotificationUnreadCountAPIView,
    AdminNotificationReadAPIView,
    AdminNotificationMarkAllReadAPIView,
    AdminNotificationDeleteAPIView,
    AdminNotificationClearAllAPIView,
)


urlpatterns = [

    # =====================================================
    # COMPANIES
    # =====================================================

    path(
        "companies/pending/",
        PendingCompanyListAPIView.as_view(),
        name="pending-companies",
    ),

    path(
        "companies/<int:company_id>/",
        CompanyDetailsAPIView.as_view(),
        name="company-details",
    ),

    path(
        "companies/<int:company_id>/approve/",
        ApproveCompanyAPIView.as_view(),
        name="approve-company",
    ),

    path(
        "companies/<int:company_id>/reject/",
        RejectCompanyAPIView.as_view(),
        name="reject-company",
    ),

    path(
        "companies/",
        CompanyListAPIView.as_view(),
        name="company-list",
    ),

    # =====================================================
    # CANDIDATES
    # =====================================================

    path(
        "candidates/",
        CandidateListAPIView.as_view(),
        name="candidate-list",
    ),

    path(
        "candidates/<int:candidate_id>/",
        CandidateDetailsAPIView.as_view(),
        name="candidate-details",
    ),

    path(
        "candidates/<int:candidate_id>/applications/",
        CandidateApplicationsAPIView.as_view(),
        name="candidate-applications",
    ),

    # =====================================================
    # USER STATUS
    # =====================================================

    path(
        "users/<int:user_id>/status/",
        UserStatusAPIView.as_view(),
        name="user-status",
    ),

    # =====================================================
    # JOBS
    # =====================================================

    path(
        "jobs/active/count/",
        ActiveJobsCountAPIView.as_view(),
        name="active-jobs-count",
    ),

    path(
        "companies/<int:company_id>/jobs/<int:job_id>/",
        CompanyJobDetailsAPIView.as_view(),
        name="company-job-details",
    ),

    # =====================================================
    # ADMIN NOTIFICATIONS
    # =====================================================

    path(
        "notifications/",
        AdminNotificationListAPIView.as_view(),
        name="admin-notifications",
    ),

    path(
        "notifications/unread-count/",
        AdminNotificationUnreadCountAPIView.as_view(),
        name="admin-notifications-unread-count",
    ),

    path(
        "notifications/<int:notification_id>/read/",
        AdminNotificationReadAPIView.as_view(),
        name="admin-notification-read",
    ),

    path(
        "notifications/read-all/",
        AdminNotificationMarkAllReadAPIView.as_view(),
        name="admin-notifications-read-all",
    ),

    path(
        "notifications/<int:notification_id>/",
        AdminNotificationDeleteAPIView.as_view(),
        name="admin-notification-delete",
    ),

    path(
        "notifications/clear-all/",
        AdminNotificationClearAllAPIView.as_view(),
        name="admin-notifications-clear-all",
    ),
]