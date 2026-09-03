from django.db import transaction
from rest_framework.exceptions import ValidationError

from company_app.models import Company, ApprovalStatus
from company_app.repositories.profile.company_repository import CompanyRepository


class CompanyService:

   
    @staticmethod
    @transaction.atomic
    def create_company_profile(user, validated_data):

        existing_company = CompanyRepository.get_company_by_user(user)

        if existing_company:
            raise ValidationError(
                {"message": "Company profile already exists."}
            )

        validated_data["user"] = user
        validated_data["approval_status"] = ApprovalStatus.PENDING

        company = CompanyRepository.create_company(
            **validated_data
        )

        user.profile_completed = True
        user.save(update_fields=["profile_completed"])

        return company

    @staticmethod
    def get_company_profile(user):
      
        company = CompanyRepository.get_company_by_user(user)

        if not company:
            raise ValidationError(
                {"message": "Company profile not found."}
            )

        return company

    @staticmethod
    @transaction.atomic
    def update_company_profile(company, validated_data):

        if company.approval_status == ApprovalStatus.REJECTED:
            validated_data["approval_status"] = ApprovalStatus.PENDING
            validated_data["rejection_reason"] = None

        return CompanyRepository.update_company(
            company,
            **validated_data
        )