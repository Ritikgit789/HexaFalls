import express from "express";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";
import pdf from "pdf-parse";
import { MongoClient } from "mongodb";
import * as genai from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
console.log("🌱 Loaded MONGO_URI:", process.env.MONGO_URI);


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/audio", express.static("temp_audio"));

const upload = multer({ dest: "temp_audio/" });

// MongoDB setup
const mongoClient = new MongoClient(process.env.MONGO_URI);
let resumesCollection;
(async () => {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("hexafalls");
    resumesCollection = db.collection("resumes");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
})();

// Google Gemini setup
const genAI = new genai.GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateLLMContent(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("✅ Prompt sent to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("❌ Gemini generation failed:", err);
    return "<p>⚠️ Failed to generate content. Try again.</p>";
  }
}

// ------------------------
// ROUTES
// ------------------------

// Upload resume, parse PDF, store in Mongo, call FastAPI matcher
app.post("/upload-resume", upload.single("file"), async (req, res) => {
  try {
    console.log("🚀 Hit /upload-resume");

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const data = await pdf(fs.readFileSync(req.file.path));
    const resumeText = data.text?.trim();

    if (!resumeText || resumeText.length < 30)
      return res.status(400).json({ error: "Resume seems empty or invalid." });

    await resumesCollection.insertOne({ text: resumeText, uploadedAt: new Date() });
    console.log("✅ Resume saved to MongoDB");

    console.log("🚀 Calling FastAPI...");
    const fastapiRes = await fetch("http://127.0.0.1:8000/match_resume_jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText, jd_text: "Backend Developer with Python" })
    });

    console.log("✅ FastAPI responded with status:", fastapiRes.status);

    if (!fastapiRes.ok) {
      const errText = await fastapiRes.text();
      console.error("❌ FastAPI returned non-OK:", errText);
      return res.status(500).json({ error: "FastAPI matcher failed", details: errText });
    }

    const json = await fastapiRes.json();
    res.json({ html: json.match_html });

  } catch (err) {
    console.error("❌ Error in /upload-resume:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Generate interview questions from last resume
app.get("/generate-questions", async (req, res) => {
  try {
    const lastResume = await resumesCollection.find().sort({ uploadedAt: -1 }).limit(1).toArray();
    if (!lastResume[0]) return res.status(404).json({ error: "No resume found." });

    const prompt = `
You are a senior interviewer. Given this resume:
${lastResume[0].text}

Generate 10 technical and 3 behavioral interview questions. 
Display them using HTML with this format:

<h3>Technical Questions</h3>
<div class="question">Question 1 text here</div>
<div class="question">Question 2 text here</div>
...
<h3>Behavioral Questions</h3>
<div class="question">Behavioral question 1 text here</div>
...

Do not use <ul> or <li>. Use only <h3> and <div class="question">...</div>.
    `;

    const html = await generateLLMContent(prompt);
    res.json({ html });

  } catch (err) {
    console.error("❌ Error generating questions:", err);
    res.status(500).json({ error: "Failed to generate questions." });
  }
});



app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
