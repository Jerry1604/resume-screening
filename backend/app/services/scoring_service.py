from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

SKILLS_DB = [
    "python", "java", "fastapi", "react",
    "sql", "machine learning", "django",
    "node", "javascript"
]


def extract_skills(text):
    text = text.lower()
    return set(skill for skill in SKILLS_DB if skill in text)


def calculate_score(resume_text, jd_text):

    resume_text = resume_text.lower()
    jd_text = jd_text.lower()

    # Skill Match (40 marks)
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    skill_score = (len(resume_skills & jd_skills) /
                  (len(jd_skills) or 1)) * 40

    #  Keyword Match (30 marks)
    jd_words = set(jd_text.split())
    resume_words = set(resume_text.split())

    keyword_score = (len(jd_words & resume_words) /
                    (len(jd_words) or 1)) * 30

    # Experience (20 marks)
    exp_score = 20 if "year" in resume_text else 0

    #  Education (10 marks)
    edu_score = 10 if any(
        x in resume_text for x in ["b.tech", "btech", "bachelor"]
    ) else 5
    

    total = skill_score + keyword_score + exp_score + edu_score

    return round(min(total, 100), 2)


