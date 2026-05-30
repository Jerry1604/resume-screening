# import re

# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity


# # ===============================
# # SKILL DATABASE
# # ===============================

# SKILLS = [
#     "python",
#     "java",
#     "react",
#     "node",
#     "fastapi",
#     "django",
#     "sql",
#     "mysql",
#     "postgresql",
#     "mongodb",
#     "machine learning",
#     "html",
#     "css",
#     "javascript",
#     "docker",
#     "aws",
#     "git"
# ]


# # ===============================
# # EXTRACT SKILLS
# # ===============================

# def extract_skills(text):

#     found = []

#     for skill in SKILLS:

#         if skill.lower() in text.lower():
#             found.append(skill)

#     return found


# # ===============================
# # EXPERIENCE MATCH
# # ===============================

# def extract_experience(text):

#     pattern = r"(\d+)\+?\s+years"

#     matches = re.findall(pattern, text.lower())

#     if matches:
#         return max([int(x) for x in matches])

#     return 0


# # ===============================
# # EDUCATION MATCH
# # ===============================

# def education_score(resume, jd):

#     education_keywords = [
#         "btech",
#         "b.e",
#         "mca",
#         "bsc",
#         "msc",
#         "computer science",
#         "information technology"
#     ]

#     score = 0

#     for edu in education_keywords:

#         if edu in resume.lower() and edu in jd.lower():
#             score += 1

#     return min(score * 20, 100)


# # ===============================
# # KEYWORD SIMILARITY
# # ===============================

# def keyword_similarity(resume, jd):

#     documents = [resume, jd]

#     tfidf = TfidfVectorizer()

#     vectors = tfidf.fit_transform(documents)

#     similarity = cosine_similarity(
#         vectors[0:1],
#         vectors[1:2]
#     )

#     return similarity[0][0] * 100


# # ===============================
# # MAIN SCORE FUNCTION
# # ===============================

# def calculate_resume_score(resume_text, jd_text):

#     # ================= SKILLS =================

#     resume_skills = extract_skills(resume_text)

#     jd_skills = extract_skills(jd_text)

#     matched_skills = set(resume_skills).intersection(jd_skills)

#     if len(jd_skills) > 0:
#         skills_score = (
#             len(matched_skills) / len(jd_skills)
#         ) * 100
#     else:
#         skills_score = 0


#     # ================= EXPERIENCE =================

#     resume_exp = extract_experience(resume_text)

#     jd_exp = extract_experience(jd_text)

#     if jd_exp == 0:
#         experience_score = 100
#     else:
#         experience_score = min(
#             (resume_exp / jd_exp) * 100,
#             100
#         )


#     # ================= EDUCATION =================

#     edu_score = education_score(
#         resume_text,
#         jd_text
#     )


#     # ================= KEYWORDS =================

#     keyword_score = keyword_similarity(
#         resume_text,
#         jd_text
#     )


#     # ================= FINAL SCORE =================

#     final_score = (

#         (skills_score * 0.40) +

#         (experience_score * 0.30) +

#         (edu_score * 0.15) +

#         (keyword_score * 0.15)

#     )

#     return {

#         "final_score": round(final_score, 2),

#         "skills_score": round(skills_score, 2),

#         "experience_score": round(experience_score, 2),

#         "education_score": round(edu_score, 2),

#         "keyword_score": round(keyword_score, 2),

#         "matched_skills": list(matched_skills)
#     }
