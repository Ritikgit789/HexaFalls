from fastapi import FastAPI
from routes import parser, matcher, interview_agent, stt, tts
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

from fastapi.staticfiles import StaticFiles

app.mount("/audio", StaticFiles(directory="temp_audio"), name="audio")

# Include routers
app.include_router(parser.router, prefix="")
app.include_router(matcher.router, prefix="")
app.include_router(interview_agent.router)
app.include_router(stt.router, prefix="/api")
app.include_router(tts.router)