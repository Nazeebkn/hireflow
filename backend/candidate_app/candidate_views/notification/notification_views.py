from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from candidate_app.serializers.notification.notification_serializer import (
    NotificationSerializer,
)
from candidate_app.services.notification.notification_service import (
    NotificationService,
)


class CandidateNotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notifications = NotificationService.get_user_notifications(
            user=request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CandidateNotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, notification_id):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification = NotificationService.mark_as_read(
            user=request.user,
            notification_id=notification_id,
        )

        if not notification:
            return Response(
                {"message": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = NotificationSerializer(notification)

        return Response(
            {
                "message": "Notification marked as read.",
                "notification": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class CandidateNotificationMarkAllReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        NotificationService.mark_all_as_read(
            user=request.user
        )

        return Response(
            {
                "message": "All notifications marked as read."
            },
            status=status.HTTP_200_OK,
        )


class CandidateNotificationUnreadCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        unread_count = NotificationService.get_unread_count(
            user=request.user
        )

        return Response(
            {
                "unread_count": unread_count
            },
            status=status.HTTP_200_OK,
        )


class CandidateNotificationClearAllAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        NotificationService.delete_all_notifications(
            user=request.user
        )

        return Response(
            {
                "message": "All notifications cleared successfully."
            },
            status=status.HTTP_200_OK,
        )


class CandidateNotificationDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, notification_id):
        candidate = getattr(
            request.user,
            "candidate_profile",
            None,
        )

        if not candidate:
            return Response(
                {"message": "Candidate profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification = NotificationService.get_notification_by_user(
            notification_id=notification_id,
            user=request.user,
        )

        if not notification:
            return Response(
                {"message": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        NotificationService.delete_notification(
            notification=notification
        )

        return Response(
            {
                "message": "Notification deleted successfully."
            },
            status=status.HTTP_200_OK,
        )