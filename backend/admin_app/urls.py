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
]