# CHANGED BY VS CODE - WebM to WAV transcription fix
import os
import shutil
import subprocess
import tempfile

from faster_whisper import WhisperModel


class SpeechToTextService:

    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            cls._model = WhisperModel(
                "base",
                device="cpu",
                compute_type="int8",
            )

        return cls._model

    @classmethod
    def transcribe_audio(cls, audio_file):
        model = cls.get_model()

        # CHANGED BY VS CODE - WebM to WAV transcription fix
        ffmpeg_path = shutil.which("ffmpeg")

        if not ffmpeg_path:
            raise RuntimeError(
                "FFmpeg is required to transcribe WebM audio."
            )

        temporary_webm_path = None
        temporary_wav_path = None

        try:
            audio_file.file.seek(0)

            with tempfile.NamedTemporaryFile(
                suffix=".webm",
                delete=False,
            ) as temporary_webm:
                temporary_webm_path = temporary_webm.name

                for chunk in audio_file.chunks():
                    temporary_webm.write(chunk)

            with tempfile.NamedTemporaryFile(
                suffix=".wav",
                delete=False,
            ) as temporary_wav:
                temporary_wav_path = temporary_wav.name

            subprocess.run(
                [
                    ffmpeg_path,
                    "-y",
                    "-i",
                    temporary_webm_path,
                    "-vn",
                    "-acodec",
                    "pcm_s16le",
                    "-ar",
                    "16000",
                    "-ac",
                    "1",
                    temporary_wav_path,
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
            )

            segments, info = model.transcribe(
                temporary_wav_path,
                beam_size=5,
                language="en",
            )

            transcript = " ".join(
                segment.text.strip()
                for segment in segments
            )

            return transcript.strip()

        except subprocess.CalledProcessError as exc:
            raise RuntimeError(
                "Failed to convert WebM audio to WAV."
            ) from exc

        finally:
            for temporary_path in (
                temporary_webm_path,
                temporary_wav_path,
            ):
                if temporary_path:
                    try:
                        os.remove(temporary_path)
                    except FileNotFoundError:
                        pass


