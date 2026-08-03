from company_app.models import Company


class CompanyRepository:

    @staticmethod
    def create_company(**validated_data):
        return Company.objects.create(**validated_data)

    @staticmethod
    def get_company_by_user(user):
        return Company.objects.filter(user=user).first()

    @staticmethod
    def update_company(company, **validated_data):
        for field, value in validated_data.items():
            setattr(company, field, value)

        company.save()
        return company