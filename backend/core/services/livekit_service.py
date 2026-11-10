import os

from livekit import api


class LiveKitService:

    @staticmethod
    def generate_token(
        room_name,
        identity,
        participant_name,
    ):
        api_key = os.getenv("LIVEKIT_API_KEY")
        api_secret = os.getenv("LIVEKIT_API_SECRET")

        if not api_key or not api_secret:
            raise ValueError(
                "LiveKit API credentials are not configured."
            )

        token = (
            api.AccessToken(api_key, api_secret)
            .with_identity(str(identity))
            .with_name(participant_name)
            .with_grants(
                api.VideoGrants(
                    room_join=True,
                    room=room_name,
                )
            )
            .to_jwt()
        )

        return token