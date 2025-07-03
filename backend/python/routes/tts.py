from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from gtts import gTTS
import os
import uuid

router = APIRouter()

class TTSRequest(BaseModel):
    text: str

@router.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    try:
        # Convert text to speech
        tts = gTTS(req.text, lang='en')
        os.makedirs("temp_audio", exist_ok=True)
        file_name = f"temp_audio/{uuid.uuid4()}.mp3"
        tts.save(file_name)

        return JSONResponse(content={"audio_url": f"/audio/{os.path.basename(file_name)}"})
    except Exception as e:
        print("❌ TTS error:", e)
        return JSONResponse(content={"audio_url": ""})
