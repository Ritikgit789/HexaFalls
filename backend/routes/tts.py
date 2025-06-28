from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from controllers.tts_controller import generate_tts

router = APIRouter()

class TTSRequest(BaseModel):
    text: str

@router.post("/text_to_speech")
async def text_to_speech(req: TTSRequest):
    try:
        audio_url = generate_tts(req.text)
        return {"audioUrl": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
