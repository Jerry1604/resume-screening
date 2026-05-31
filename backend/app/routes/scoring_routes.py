from fastapi import APIRouter
from pydantic import BaseModel
import os
import re

from app.utils.parser import extract_text

router = APIRouter()
UPLOAD_DIR = "app/uploads"


# REQUEST MODEL
class ScoreRequest(BaseModel):
    jd: str
    resumes: list



# GLOBAL TEXT NORMALIZER
def normalize(text: str):
    text = text.lower()

    # fix OCR spacing: "j e r i s h" → "jerish"
    text = re.sub(r"(?:\b[a-z]\s){2,}[a-z]\b", lambda m: m.group(0).replace(" ", ""), text)

    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-z0-9+#. ]", " ", text)

    return text


# NAME EXTRACTION (FIXED)
def extract_name(text: str):
    text = normalize(text)

    words = text.split()

    # take first meaningful words
    name_parts = []

    for w in words[:20]:
        if w.isalpha() and len(w) > 2:
            if w not in ["resume", "summary", "developer", "engineer"]:
                name_parts.append(w)

        if len(name_parts) == 3:
            break

    if 2 <= len(name_parts) <= 3:
        return " ".join(name_parts).title()

    return "Unknown Candidate"

# EXPERIENCE EXTRACTION

def extract_experience(text: str):
    t = normalize(text)

    print("RESUME TEXT:")
    print(t[:1000])  # first 1000 chars

    years = re.findall(
        r"(\d+)\+?\s*(?:years?|yrs?)\s+of\s+experience",
        t
    )

    print("EXPERIENCE MATCHES:", years)

    if years:
        return max(int(y) for y in years)

    if "intern" in t:
        return 1

    if "fresher" in t:
        return 0

    return 0


def experience_label(years: int):
    if years == 0:
        return "Fresher"
    if years == 1:
        return "1 Year"
    if years == 2:
        return "2 Years"
    return "3+ Years"


# EDUCATION EXTRACTION
def extract_education(text: str):
    t = normalize(text)

    if "phd" in t:
        return "PhD"
    if "mtech" in t or "m.tech" in t:
        return "M.Tech"
    if "mca" in t:
        return "MCA"
    if "btech" in t or "b.tech" in t:
        return "B.Tech"
    if "b.e" in t or "be " in t:
        return "B.E"
    if "bsc" in t:
        return "B.Sc"

    return "Not Found"



# SKILL EXTRACTION
def extract_skills(text: str):
    t = normalize(text)

    skills_map = {
        "python": ["python"],
        "react": ["react"],
        "fastapi": ["fastapi"],
        "sql": ["sql", "postgresql", "mysql"],
        "docker": ["docker"],
        "aws": ["aws"],
        "javascript": ["javascript", "js"],
        "css": ["css", "css3"],
        "html": ["html", "html5"]
    }

    found = set()

    for skill, keywords in skills_map.items():
      if any(re.search(rf"\b{re.escape(k)}\b", t)
             for k in keywords):
             found.add(skill)
        
    return found


# SCORE ENGINE
def compute_score(resume_text, jd_text):

    resume_clean = normalize(resume_text)
    jd_clean = normalize(jd_text)

    resume_skills = extract_skills(resume_clean)
    jd_skills = extract_skills(jd_clean)

    # skills score
    skills_score = (
        len(resume_skills & jd_skills) / len(jd_skills) * 100
        if jd_skills else 0
    )

    # keyword score (safe)
    resume_words = set(resume_clean.split())
    jd_words = set(jd_clean.split())

    keyword_score = len(resume_words & jd_words) / max(len(jd_words), 1) * 100

    # experience
    exp_years = extract_experience(resume_clean)
    experience_score = min(100, exp_years * 25)

    # education
    edu = extract_education(resume_clean)

    edu_score_map = {
        "PhD": 95,
        "M.Tech": 90,
        "MCA": 85,
        "B.Tech": 80,
        "B.E": 80,
        "B.Sc": 70,
        "Not Found": 50
    }

    education_score = edu_score_map.get(edu, 50)

    final_score = (
        keyword_score * 0.3 +
        experience_score * 0.2 +
        education_score * 0.1
    )

    return {
        "final_score": round(final_score, 2),
        # "skills_score": round(skills_score, 2),
        "keyword_score": round(keyword_score, 2),
        "experience_score": experience_score,
        "education_score": education_score
    }



# API ROUTE
@router.post("/score")
async def score_resumes(data: ScoreRequest):

    results = []
    seen = set()

    jd_skills = extract_skills(normalize(data.jd))

    for filename in data.resumes:

        if filename in seen:
            continue
        seen.add(filename)

        file_path = os.path.join(UPLOAD_DIR, filename)
        resume_text = extract_text(file_path)

        resume_clean = normalize(resume_text)

        score_obj = compute_score(resume_text, data.jd)

        resume_skills = extract_skills(resume_clean)

        matched_skills = sorted(list(resume_skills & jd_skills))
        missing_skills = sorted(list(jd_skills - resume_skills))

        exp = extract_experience(resume_clean)
        edu = extract_education(resume_clean)

        results.append({
            "candidate": extract_name(resume_text),

            "score": score_obj["final_score"],
            "score_breakdown": score_obj,

            "experience_years": exp,
            "experience_label": experience_label(exp),

            "education": edu,

            "resume_preview": " ".join(resume_text.split()[:120]),

            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return {"ranked_candidates": results}



