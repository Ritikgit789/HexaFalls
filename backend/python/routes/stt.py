from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import whisper
import os

router = APIRouter()

# Load Whisper model
model = whisper.load_model("base")

@router.post("/api/stt")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        contents = await file.read()
        temp_file_path = "temp_audio/temp.wav"
        os.makedirs("temp_audio", exist_ok=True)
        with open(temp_file_path, "wb") as f:
            f.write(contents)

        # Transcribe
        result = model.transcribe(temp_file_path)
        text = result["text"]

        return JSONResponse(content={"text": text})
    except Exception as e:
        print("❌ STT error:", e)
        return JSONResponse(content={"text": "⚠️ Error transcribing audio."})
