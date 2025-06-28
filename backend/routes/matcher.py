# from fastapi import APIRouter
# from pydantic import BaseModel
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity

# router = APIRouter()
# model = SentenceTransformer("all-MiniLM-L6-v2")  # Fast, light & powerful

# class MatchRequest(BaseModel):
#     resume_text: str
#     jd_text: str

# @router.post("/match_resume_jd")
# def match_resume(data: MatchRequest):
#     res_vec = model.encode([data.resume_text])[0]
#     jd_vec = model.encode([data.jd_text])[0]
#     score = cosine_similarity([res_vec], [jd_vec])[0][0]
#     final_score = round(float(score) * 100, 2)

#     decision = (
#         "✅ Excellent Match - please check our mock interview platform" if final_score > 85 else
#         "⚠️ Moderate Match – Needs Improvement - Please update your resume, add some keywords relevant to Job decsription" if final_score > 70 else
#         "❌ Low Match – Resume needs update"
#     )

#     return {
#         "score": final_score,
#         "decision": decision
#     }



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
# ✅ Configure Gemini
gemini_api_key = os.getenv("GOOGLE_API_KEY")

# Then configure Gemini
genai.configure(api_key=gemini_api_key)


class MatchRequest(BaseModel):
    resume_text: str
    jd_text: str

def generate_suggestions_with_gemini(jd_text, resume_text):
    prompt = f"""
You are a professional resume advisor.

JOB DESCRIPTION:
{jd_text}

CANDIDATE RESUME:
{resume_text}

Compare the two and:
1. Suggest 3–5 missing skills or keywords in the resume according to the relevant resume and fields.
2. Recommend changes to better align the resume.
3. See the resume and also Job description or JD at first better like which fields candidates are applying for and has experience.
4. Mention any sections to rewrite or add (summary, experience, etc.).
5. If score is above 80 and get excellent match, then no need to giev any recommendations, only tell "Okay, your resume is a better fit for this role".
6. Give the points in a good structure format, short, simple, concise and looking good, and don't tell any irrelvant questions or answers, and try to ask follow -up questions like "Do you need help to revamp your resume?" or this type of questions.

Output in bullet points.
"""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"⚠️ Gemini Error: {str(e)}"

@router.post("/match_resume_jd")
def match_resume(data: MatchRequest):
    res_vec = model.encode([data.resume_text])[0]
    jd_vec = model.encode([data.jd_text])[0]
    score = cosine_similarity([res_vec], [jd_vec])[0][0]
    final_score = round(float(score) * 100, 2)

    decision = (
        "✅ Excellent Match" if final_score > 85 else
        "⚠️ Moderate Match – Improve resume" if final_score > 70 else
        "❌ Low Match – Resume needs major update"
    )

    suggestions = generate_suggestions_with_gemini(data.jd_text, data.resume_text)

    return {
        "match_score": final_score,
        "decision": decision,
        "llm_suggestions": suggestions
    }

