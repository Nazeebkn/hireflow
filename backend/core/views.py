
import os
import logging

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from livekit import api

logger = logging.getLogger(__name__)

from core.services.livekit_webhook_service import LiveKitWebhookService

@csrf_exempt
@require_POST
def livekit_webhook(request):
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")

    if not api_key or not api_secret:
        logger.error("LiveKit credentials are missing.")
        return HttpResponse(status=500)

    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return HttpResponse(status=401)

    try:
        receiver = api.WebhookReceiver(
            api.TokenVerifier(api_key, api_secret)
        )

        event = receiver.receive(
            request.body.decode("utf-8"),
            auth_header,
        )

    except Exception:
        logger.warning("Invalid LiveKit webhook signature.")
        return HttpResponse(status=401)

    try:
        LiveKitWebhookService.process_event(event)
    except Exception:
        logger.exception("Failed to process LiveKit webhook.")
        return HttpResponse(status=500)

    logger.info(
        "LiveKit webhook processed: event=%s room=%s",
        event.event,
        event.room.name if event.room else None,
    )

    return HttpResponse(status=200)
