from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from admin_app.serializers.admin.user_status_serializer import (
    UserStatusSerializer,
)

from admin_app.services.admin.user_status_service import (
    UserStatusService,
)


class UserStatusAPIView(APIView):

    def patch(self, request, user_id):

        serializer = UserStatusSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        UserStatusService.update_user_status(
            user_id,
            serializer.validated_data["is_active"],
        )

        return Response(
            {
                "message": "User status updated successfully."
            },
            status=status.HTTP_200_OK,
        )