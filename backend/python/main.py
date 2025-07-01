from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from routes import parser, matcher, interview_agent, stt, tts, chat_qp
import os
import whisper

# ✅ Load environment variables
load_dotenv()

# ✅ Create app
app = FastAPI()

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure temp_audio dir exists for whisper & tts
os.makedirs("temp_audio", exist_ok=True)

# ✅ Serve static files (TTS mp3 etc)
app.mount("/audio", StaticFiles(directory="temp_audio"), name="audio")

# ✅ Include all routers
app.include_router(parser.router, prefix="")
app.include_router(matcher.router, prefix="")
app.include_router(interview_agent.router, prefix="")
app.include_router(stt.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(chat_qp.router, prefix="")

# ✅ Optional quick whisper test (handy for curl)
@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        temp_path = f"temp_audio/{file.filename}"
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        model = whisper.load_model("base")
        result = model.transcribe(temp_path)
        return {"transcription": result["text"]}
    except Exception as e:
        return {"error": str(e)}
