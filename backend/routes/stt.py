from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from controllers.stt_controller import handle_stt

router = APIRouter()

class AudioRequest(BaseModel):
    audioData: str  # Base64 audio

@router.post("/speech_to_text")
async def speech_to_text(req: AudioRequest):
    text = await handle_stt(req.audioData)
    return {"text": text}
