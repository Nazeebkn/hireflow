
from django.db import models


class LiveKitWebhookEvent(models.Model):
    event_id = models.CharField(
        max_length=255,
        unique=True,
    )

    event_type = models.CharField(
        max_length=100,
    )

    room_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    received_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "core_livekit_webhook_events"
        ordering = ["-received_at"]

    def __str__(self):
        return f"{self.event_type} - {self.event_id}"
