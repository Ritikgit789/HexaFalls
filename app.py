import streamlit as st
import requests
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pandas as pd
import altair as alt


# --- Load environment variables ---
load_dotenv()
BACKEND_URL = "http://127.0.0.1:8000"
MATCH_ENDPOINT = f"{BACKEND_URL}/match-jobs"
EMAIL_APP_PASSWORD = os.getenv("SMTP_PASS")
EMAIL_SENDER = os.getenv("SMTP_USER")

# --- Streamlit Setup ---
st.set_page_config(page_title="Job Matcher", page_icon="📄", layout="wide")

# --- Custom CSS & Animations ---
st.markdown("""
<style>
    html, body, [class*="css"]  { font-family: 'Segoe UI', sans-serif; }
    .main-header {
        text-align: center;
        padding: 2rem 0 1rem 0;
        background: linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%);
        color: #222;
        border-bottom: 2px solid #cce;
        margin-bottom: 2rem;
        animation: fadeInDown 1.2s;
    }
    .job-box {
        background: linear-gradient(90deg, #fff 70%, #f0f7ff 100%);
        color: #222;
        padding: 1.5rem;
        margin: 1.5rem 0;
        border-radius: 15px;
        border: 1.5px solid #b3c6e0;
        box-shadow: 0 4px 16px rgba(100,180,255,0.12);
        transition: transform 0.18s;
    }
    .job-box:hover {
        transform: scale(1.025) translateY(-3px);
        box-shadow: 0 8px 24px rgba(80,120,255,0.15);
        border-color: #6fa8dc;
    }
    .recommend-box {
        padding:1.5rem;
        background: linear-gradient(90deg, #2c5364 0%, #203a43 100%);
        color:white;
        border-radius:12px;
        margin:1.5rem 0;
        font-size:17px;
        border: 1px solid #444;
        box-shadow: 0 2px 10px rgba(30,40,60,0.10);
        animation: fadeIn 1.5s;
    }
    .cold-mail-title {
        font-size: 1.3rem;
        font-weight: bold;
        margin-top:2.5rem;
        color: #2c5364;
        letter-spacing: 0.5px;
    }
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px);}
        to { opacity: 1; transform: translateY(0);}
    }
    @keyframes fadeIn {
        from { opacity: 0;}
        to { opacity: 1;}
    }
</style>
""", unsafe_allow_html=True)

# --- Sidebar Tools ---
with st.sidebar:
    st.title("🛠️ Tools & Info")
    st.markdown("- **Download your matches** as CSV")
    st.markdown("- **Word count** for your resume")
    st.markdown("- **Toggle dark/light mode** (Streamlit default)")
    dark_mode = st.toggle("🌙 Dark Mode", value=False)
    if "resume_data" in st.session_state:
        resume_text = st.session_state.resume_data.get("resume_text", "")
        st.info(f"**Resume Word Count:** {len(resume_text.split())}")

# --- Header ---
st.markdown("""
    <div class="main-header">
        <h1 style="font-size:2.5rem">🎯 <span style="color:#3a7bd5">Job Matches</span> Based on Your Resume</h1>
        <p style="font-size:1.2rem;">Paste your resume JSON and see matched jobs + Gemini recommendations</p>
    </div>
""", unsafe_allow_html=True)

# --- Input Area ---
st.subheader("📄 Paste Resume JSON")
resume_json_input = st.text_area(
    "Paste here (e.g., {\"resume_text\": ..., \"skills\": [...], \"email\": \"...\"})",
    height=300,
    placeholder='{"resume_text": "I am a Python and ML engineer...", "skills": ["Python", "ML", "TensorFlow"], "email": "me@example.com"}'
)

# --- Main Action ---
if st.button("🔍 Find Matches"):
    try:
        resume_json = eval(resume_json_input) if isinstance(resume_json_input, str) else resume_json_input

        with st.spinner("Fetching job matches..."):
            response = requests.post(MATCH_ENDPOINT, json=resume_json)
            response.raise_for_status()
            result = response.json()

        st.session_state.resume_data = resume_json
        st.session_state.job_data = result.get("jobs", [])
        st.session_state.recommendations = result.get("recommendations")

    except Exception as e:
        st.error(f"❌ Error: {e}")

# --- Show Recommendations ---
if "recommendations" in st.session_state:
    st.markdown("## 🤖 AI Recommendations")
    st.markdown(f"""
    <div class="recommend-box">
        {st.session_state.recommendations}
    </div>
    """, unsafe_allow_html=True)



# --- Show Matched Jobs + Download ---
if "job_data" in st.session_state and st.session_state.job_data:
    st.success(f"✅ {len(st.session_state.job_data)} jobs matched with your resume")

    # Download as CSV tool
    df = pd.DataFrame(st.session_state.job_data)
    st.download_button(
        label="⬇️ Download Matches as CSV",
        data=df.to_csv(index=False).encode("utf-8"),
        file_name="job_matches.csv",
        mime="text/csv"
    )

    for job in st.session_state.job_data:
        st.markdown(f"""
            <div class="job-box">
                <h3>💼 {job.get("title", "Job Title")} <span style="font-weight:normal;">at</span> <span style="color:#3a7bd5">{job.get("company", "Company")}</span></h3>
                <p>
                    <b>📍 Location:</b> {job.get("location", "Location")}<br>
                    <b>💼 Type:</b> {job.get("job_type", "Full-time")}<br>
                    <b>⏱️ Experience:</b> {job.get("experience", "2+ years")}<br>
                </p>
                <p><b>🛠️ Skills:</b> {", ".join(job.get("skills", []))}</p>
                <p><b>📧 Contact:</b> {job.get("email", "N/A")}</p>
            </div>
        """, unsafe_allow_html=True)

    # --- Cold Mail Section ---
    st.markdown('<div class="cold-mail-title">✉️ Cold Mail Agent</div>', unsafe_allow_html=True)

    mail_options = [
        f"{job['title']} at {job['company']} ({job.get('email', 'N/A')})"
        for job in st.session_state.job_data if "email" in job and job["email"] != "N/A"
    ]

    if mail_options:
        selected = st.selectbox("Choose a company to cold email", options=mail_options)
        selected_email = selected.split("(")[-1].replace(")", "").strip()

        with st.form("cold_mail_form"):
            candidate_email = st.session_state.resume_data.get("email", "unknown@example.com")
            candidate_skills = ", ".join(st.session_state.resume_data.get("skills", []))

            generated_body = f"""
Hi Hiring Team at {selected.split(' at ')[1].split(' (')[0]},

I'm reaching out regarding the {selected.split(' at ')[0]} role. Based on my experience and skills in {candidate_skills}, I believe I would be a great fit for your team.

Looking forward to the opportunity to contribute.

Thanks,  
{candidate_email}
            """.strip()

            st.text_area("📧 Mail Preview - Cold Mail Agent", value=generated_body, height=200)
            send_clicked = st.form_submit_button("🚀 Send Cold Mail")

            if send_clicked:
                try:
                    msg = MIMEMultipart()
                    msg["From"] = EMAIL_SENDER
                    msg["To"] = selected_email
                    msg["Subject"] = f"Cold Application: {selected.split(' at ')[0]}"
                    msg.attach(MIMEText(generated_body, "plain"))

                    with smtplib.SMTP("smtp.gmail.com", 587) as server:
                        server.starttls()
                        server.login(EMAIL_SENDER, EMAIL_APP_PASSWORD)
                        server.sendmail(EMAIL_SENDER, selected_email, msg.as_string())

                    st.success(f"✅ Cold mail sent to {selected_email}")
                except Exception as e:
                    st.error(f"❌ Failed to send email: {e}")
    else:
        st.warning("No valid email addresses found in job matches.")

