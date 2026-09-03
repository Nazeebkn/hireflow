from django.urls import path
from admin_app.views.admin.pending_company_view import (
    PendingCompanyListAPIView,
)
from admin_app.views.admin.company_details_view import (
    CompanyDetailsAPIView,
)
from admin_app.views.admin.approve_company_view import (
    ApproveCompanyAPIView,
)
from admin_app.views.admin.reject_company_view import (
    RejectCompanyAPIView,
)
from admin_app.views.admin.company_list_view import (
    CompanyListAPIView,
)
from admin_app.views.admin.candidate_list_view import (
    CandidateListAPIView,
)
from admin_app.views.admin.candidate_details_view import (
    CandidateDetailsAPIView,
)
from admin_app.views.admin.user_status_view import (
    UserStatusAPIView,
)
urlpatterns = [
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
    "users/<int:user_id>/status/",
    UserStatusAPIView.as_view(),
    name="user-status",
    ),
]