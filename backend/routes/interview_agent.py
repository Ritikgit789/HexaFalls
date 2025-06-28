from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

# Gemini API configuration
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

class HistoryItem(BaseModel):
    role: Literal["user", "interviewer"]
    content: str

class InterviewRequest(BaseModel):
    resume: Optional[str]
    jobDescription: Optional[str]
    userResponse: Optional[str]
    history: List[HistoryItem] = []
    questionCount: int
    jobType: str = "technical position"

def get_system_prompt(question_count: int, job_type: str) -> str:
    if question_count == 0:
        return f"""
You are an AI interview assistant for a {job_type}.
Start by asking the candidate to introduce themselves in a professional and friendly way.
"""
    elif 1 <= question_count <= 3:
        return f"""
You are an AI mock interviewer for a {job_type} role.

Stage: Resume-Based Questions
Ask any one question about:
- Q1: Technical skills
- Q2: Relevant project
- Q3: A challenge they handled

Reference resume. Be warm and brief and friendly. Do not repeat questions. Do not ask more than one or two questions out of any topic. No answers, only ask.Do not tell any extra lines or like I am ready to hear or I am interested in hearing, only 1 question relevant.
"""
    elif 4 <= question_count <= 7:
        return f"""
You are an AI mock interviewer for a {job_type} role.

Stage: Job Description-Based Questions
Ask one-two question about:
- Q4: Key skills in JD
- Q5: Job responsibilities
- Q6: Behavioral scenario
- Q7: Role interest

Use only JD. Be warm and brief and friendly. In this stage, the name user told, start with Ok --- his name and then ask. No answers. Do not ask more than one or two questions out of any topic. No history.
"""
    else:
        return f"""
You are an AI mock interviewer for a {job_type} role.

Stage: Final Questions
- Q8/Q9: Ask about why you are a better fit for this role or like salary expectations or questions for the user.
- Q10: Provide structured final feedback based on all interview responses.

Be specific. Be warm and brief and friendly. Do not hallucinate. Be fair and structured.
"""

@router.post("/mock_interview_question")
async def handle_mock_interview(data: InterviewRequest):
    try:
        # Step 1: Generate single prompt from all messages
        parts = []

        if data.questionCount == 0:
            parts.append(f"Resume:\n{data.resume[:9000]}")
            parts.append(f"Job Description:\n{data.jobDescription[:9000]}")
            parts.append("Ask an introductory question.")
        elif 1 <= data.questionCount <= 3:
            parts.append(f"Resume:\n{data.resume[:9000]}")
            parts.append(f"Ask question #{data.questionCount} based on the resume.")
            for item in data.history:
                parts.append(f"{item.role.upper()}: {item.content}")
            if data.userResponse:
                parts.append(f"USER: {data.userResponse}")
        elif 4 <= data.questionCount <= 7:
            parts.append(f"Job Description:\n{data.jobDescription[:9000]}")
            parts.append(f"Ask question #{data.questionCount} about the JD.")
            if data.userResponse:
                parts.append(f"USER: {data.userResponse}")
        else:
            parts.append(f"Resume:\n{data.resume[:9000]}")
            parts.append(f"Job Description:\n{data.jobDescription[:9000]}")
            parts.append(f"Interview History:\n{str(data.history)}")
            parts.append(f"This is question #{data.questionCount}. Ask or give final feedback accordingly.")
            for item in data.history:
                parts.append(f"{item.role.upper()}: {item.content}")
            if data.userResponse:
                parts.append(f"USER: {data.userResponse}")

        # Step 2: Get system prompt
        system_prompt = get_system_prompt(data.questionCount, data.jobType)

        # Step 3: Combine prompt
        full_prompt = system_prompt + "\n\n" + "\n".join(parts)

        # Step 4: Call Gemini
        response = model.generate_content(full_prompt)

        return {
            "message": response.text,
            "questionCount": data.questionCount
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
