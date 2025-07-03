from fastapi import HTTPException
import requests
import uuid
from pathlib import Path
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

AUDIO_DIR = Path("temp_audio")
AUDIO_DIR.mkdir(exist_ok=True)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise HTTPException(status_code=500, detail="Missing ElevenLabs API Key in environment.")

def generate_tts(text: str) -> str:
    try:
        url = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL"
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        payload = {
            "text": text[:5000],
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }

        response = requests.post(url, json=payload, headers=headers, stream=True)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="TTS API failed")

        filename = f"tts-{uuid.uuid4().hex}.mp3"
        filepath = AUDIO_DIR / filename
        with open(filepath, "wb") as f:
            f.write(response.content)

        return f"/audio/{filename}"

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS Error: {str(e)}")