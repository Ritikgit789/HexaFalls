from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
from pymongo import MongoClient

# Load .env and initialize Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()

# Setup MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["hexafalls"]
resumes_collection = db["resumes"]

class ChatRequest(BaseModel):
    message: str

@router.post("/chat-qp")
async def chat_qp(request: ChatRequest):
    try:
        # Get latest resume
        last_resume_cursor = resumes_collection.find().sort("uploadedAt", -1).limit(1)
        last_resume_list = list(last_resume_cursor)
        resume_text = last_resume_list[0]["text"] if last_resume_list else ""

        # Build prompt
        prompt = f"""
You are a senior interviewer. 
Given the candidate's resume below:

{resume_text}

Now, the user asks:
"{request.message}"

Respond ONLY using HTML format:
<ul>
  <li>Question 1 or comment</li>
  <li>Question 2 or insight</li>
</ul>

Do NOT use markdown. Do NOT wrap it in <body> or <html>. Only <ul> and <li>.
"""

        # ✅ Use Gemini (flash latest is usually fastest + cheapest)
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Defensive fallback: if Gemini returns plain lines, wrap them
        if not text.startswith("<"):
            lines = [line.strip("-• ").strip() for line in text.split("\n") if line.strip()]
            text = "<ul>" + "".join(f"<li>{line}</li>" for line in lines) + "</ul>"

        print("✅ Gemini response generated")
        return {"response": text}

    except Exception as e:
        print("❌ Gemini error:", e)
        return {"response": "⚠️ Error getting response from Gemini."}
