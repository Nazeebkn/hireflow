from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from admin_app.services.admin.active_jobs_service import ActiveJobsService


class ActiveJobsCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = ActiveJobsService.get_active_jobs_count()

        return Response(
            {
                "active_jobs_count": count
            },
            status=200
        )   