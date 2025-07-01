from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
import os
from dotenv import load_dotenv

router = APIRouter()
model = SentenceTransformer("all-MiniLM-L6-v2")

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class MatchRequest(BaseModel):
    resume_text: str
    jd_text: str

def generate_html_suggestions(jd_text, resume_text):
    print("⚙️ Starting generate_html_suggestions")
    prompt = f"""
You are a professional resume consultant.  
Given the following:

JOB DESCRIPTION:
{jd_text}

CANDIDATE RESUME:
{resume_text}

- Compare them.
- Identify missing skills / keywords.
- Recommend resume changes to align better.
- Highlight which roles this resume suits.
- Suggest sections to rewrite or add.
- Provide an approximate fit score out of 100.
- Give a final action checklist.

Format your entire output as **clean HTML**, using:
- <h3> for headings
- <ul><li> for bullet lists
- <strong> to highlight scores or important phrases
DO NOT use markdown. Only valid HTML.

Example:
<h3>Missing Skills</h3>
<ul><li>Python</li><li>Docker</li></ul>
"""
    try:
        print("📝 Preparing Gemini model...")
        gemini_model = genai.GenerativeModel("gemini-2.0-flash")
        print("🚀 Sending prompt to Gemini")
        response = gemini_model.generate_content(prompt)
        print("✅ Gemini responded successfully")
        return response.text
    except Exception as e:
        print("❌ Gemini generation failed:", str(e))
        return f"<p>⚠️ Gemini Error: {str(e)}</p>"

@router.post("/match_resume_jd")
def match_resume(data: MatchRequest):
    print("🔍 /match_resume_jd endpoint hit")
    print(f"📄 Resume text length: {len(data.resume_text)}")
    print(f"📄 JD text length: {len(data.jd_text)}")

    res_vec = model.encode([data.resume_text])[0]
    jd_vec = model.encode([data.jd_text])[0]
    print("✅ Vectors computed")

    score = cosine_similarity([res_vec], [jd_vec])[0][0]
    final_score = round(float(score) * 100, 2)
    print(f"📊 Cosine similarity score: {final_score}%")

    html_suggestions = generate_html_suggestions(data.jd_text, data.resume_text)
    print("✅ HTML suggestions generated")

    summary_html = f"""
    <h3>Summary Analysis</h3>
    <ul>
        <li>Match Score: <strong>{final_score}%</strong></li>
        <li>Decision: {"✅ Excellent Match" if final_score > 85 else "⚠️ Moderate Match" if final_score > 70 else "❌ Low Match"}</li>
    </ul>
    """

    print("🚀 Sending final response to client")
    return {
        "match_html": summary_html + html_suggestions
    }
