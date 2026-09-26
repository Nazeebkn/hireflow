import os
import time
from google import genai


class GeminiService:

    @staticmethod
    def get_client():
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is not configured."
            )

        return genai.Client(api_key=api_key)

    @staticmethod
    def generate_text(prompt):
        client = GeminiService.get_client()

        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=prompt,
        )

        return interaction.output_text
        
            
    @staticmethod
    def transcribe_audio(audio_file_path):
        client = GeminiService.get_client()

        uploaded_file = client.files.upload(
            file=audio_file_path
        )

        while uploaded_file.state and uploaded_file.state.name == "PROCESSING":
            time.sleep(2)

            uploaded_file = client.files.get(
                name=uploaded_file.name
            )

        if uploaded_file.state and uploaded_file.state.name == "FAILED":
            print("FILE STATE:", uploaded_file.state)
            print("FILE NAME:", uploaded_file.name)
            print("FILE OBJECT:", uploaded_file)
            return None
        
        interaction = client.interactions.create(
            model="gemini-3.5-transcribe",
            input=[
                {
                    "type": "audio",
                    "uri": uploaded_file.uri,
                    "mime_type": uploaded_file.mime_type,
                }
            ],
        )

        return interaction.output_text