
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

SKILLS_DB = [
    "python", "java", "fastapi", "react",
    "sql", "machine learning", "django",
    "node", "javascript","css","postgresql"
    ]


def extract_skills(text):
    text = text.lower()
    found = set()

    for skill in SKILLS_DB:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            found.add(skill)

    return found



def calculate_score(resume_text, jd_text):

    resume_text = resume_text.lower()
    jd_text = jd_text.lower()

    # Skills for display only
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)


    #  Keyword Match (30 marks)
    matched_skills = resume_skills.intersection(jd_skills)
    keyword_score = (
    len(matched_skills) /
    (len(jd_skills) or 1)
) * 30

    # Experience (20 marks)
   
    match = re.search(
        r"(\d+)\+?\s*years?\s+of\s+experience",
        resume_text
        )
    if match:
        years = int(match.group(1))
        exp_score = min(years * 10, 20)
    else:
        exp_score = 0
    # exp_score = 20 if "year" in resume_text else 0

    #  Education (10 marks)
    edu_score = 10 if any(
        x in resume_text for x in ["b.tech", "btech", "bachelor"]
    ) else 5
    
# skill_score 
    total =  keyword_score + exp_score + edu_score

    return round(min(total, 100), 2)
 


