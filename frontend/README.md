# Resume Screening & Candidate Ranking System

A full-stack AI-powered web application that automates resume screening and ranks candidates based on job description matching.

---

## 🚀 Live Application

- Frontend: https://resume-screening-jqa4.vercel.app
- Backend API: https://resume-screening-2-mhvq.onrender.com

---

## 🧠 Architecture Overview

The system follows a client-server architecture:

- Frontend (React): Handles file uploads and displays ranked results
- Backend (FastAPI): Processes resumes, extracts skills, and computes scores
- Storage: Local file storage for uploaded resumes and job descriptions

### Flow:
User Upload → Backend Processing → Skill Extraction → Scoring Engine → Ranked Output

---

## ⚙️ Tech Stack

- Frontend: React, JavaScript, Tailwind CSS
- Backend: FastAPI (Python)
- File Handling: Python UploadFile API
- Deployment:
  - Frontend: Vercel
  - Backend: Render / Railway

---

## 📊 Scoring Approach

Candidates are ranked using a weighted scoring system:

### 1. Skill Matching (50%)
- Extract skills from resume
- Compare with JD keywords
- Calculate overlap score

### 2. Experience Score (30%)
- Extract years of experience using text patterns
- Normalize to scoring scale

### 3. Education Score (20%)
- Evaluate degree relevance

### Final Score Formula:

---

## 📂 Features

- Upload multiple resumes
- Upload Job Description (PDF/Text)
- AI-based candidate ranking
- Real-time scoring
- Clean UI dashboard

---

## 📌 Assumptions

- Resumes are in English text format
- Experience is extracted using regex-based logic
- Skill extraction is keyword-based (not deep learning model)
- File size is limited for performance reasons

---

## 🛠️ Setup Instructions

### Backend
```bash id="setup1"
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
## frontend
cd frontend
npm install
npm run dev

---

# 📄 4. Brief Documentation (Interview Version)

## 🧠 Architecture Summary

> The system is a full-stack resume screening application built using React and FastAPI. The frontend handles user interaction and file uploads, while the backend processes resumes, extracts structured data, and computes candidate scores based on similarity with the job description.

---

## ⚙️ Scoring Logic

- Skill Match → 50%
- Experience → 30%
- Education → 20%

The system ranks candidates based on weighted similarity between resume content and job description requirements.

---

## 📌 Key Assumptions

- Resumes are structured text-based PDFs
- Skill extraction uses rule-based keyword matching
- No external ML model training is used
- Focus is on explainability and simplicity of scoring

