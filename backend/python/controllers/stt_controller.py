import os
import uuid
import aiofiles
import shutil
import httpx
from fastapi import HTTPException
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

AUDIO_DIR = Path("temp_audio")
AUDIO_DIR.mkdir(exist_ok=True)

async def handle_stt(audio_base64: str) -> str:
    try:
        # Extract actual base64 content
        encoded_data = audio_base64.split(",")[1]

        # Generate unique filename
        filename = f"stt-{uuid.uuid4()}.mp3"
        filepath = AUDIO_DIR / filename

        # Save to temp file
        async with aiofiles.open(filepath, "wb") as f:
            await f.write(bytes.fromhex(encoded_data.encode().hex()))

        # Prepare multipart form
        headers = {
            "xi-api-key": os.getenv("ELEVENLABS_API_KEY"),
        }

        async with httpx.AsyncClient() as client:
            with filepath.open("rb") as file:
                files = {
                    "file": (filename, file, "audio/mpeg"),
                    "model_id": (None, "scribe_v1")
                }

                response = await client.post(
                    "https://api.elevenlabs.io/v1/speech-to-text",
                    headers=headers,
                    files=files
                )

        # Delete temp file
        filepath.unlink()

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="ElevenLabs API error")

        return response.json().get("text", "")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech recognition failed: {str(e)}")