from fastapi import UploadFile, File, APIRouter
import fitz  # PyMuPDF
from resume_parser import ResumeParser  # Make sure import path is correct

router = APIRouter()

@router.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()

    # Extract resume text from PDF using fitz
    doc = fitz.open(stream=contents, filetype="pdf")
    extracted_text = ""
    for page in doc:
        extracted_text += page.get_text()

    text = extracted_text.strip()

    # Parse individual details from extracted text
    name = ResumeParser.extract_name(text)
    email = ResumeParser.extract_email_from_resume(text)
    phone = ResumeParser.extract_mobile_numbers(text)
    education = ResumeParser.extract_education_from_resume(text)
    dob, age = ResumeParser.extract_dob_age(text)
    gender = ResumeParser.extract_gender_from_resume(text)
    projects = ResumeParser.extract_projects_from_resume(text)
    experience = ResumeParser.extract_experience_from_resume(text)
    date_of_birth = ResumeParser.format_date_to_custom(dob)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "education": education,
        "date_of_birth": date_of_birth,
        "age": age,
        "gender": gender,
        "experience": experience,
        "extracted_text": text[:300] + "..."  # Optional preview
    }
