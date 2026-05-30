# from fastapi import APIRouter
# import os

# from app.services.parser_service import (
#     extract_pdf_text,
#     extract_docx_text
# )

# from app.services.scoring_service import calculate_score

# router = APIRouter()

# UPLOAD_DIR = "app/uploads"


# # Simple skills list
# SKILLS = [
#     "python",
#     "react",
#     "fastapi",
#     "postgresql",
#     "sql",
#     "javascript",
#     "docker",
#     "aws",
#     "html",
#     "css"
# ]


# # Extract skills from text
# def extract_skills(text):

#     found_skills = []

#     text = text.lower()

#     for skill in SKILLS:

#         if skill in text:
#             found_skills.append(skill)

#     return found_skills


# @router.post("/analyze")
# def analyze_resumes(jd_text: str):

#     results = []

#     # Extract JD skills
#     jd_skills = extract_skills(jd_text)

#     # Loop through uploaded resumes
#     for filename in os.listdir(UPLOAD_DIR):

#         file_path = os.path.join(
#             UPLOAD_DIR,
#             filename
#         )

#         resume_text = ""

#         # PDF
#         if filename.endswith(".pdf"):
#             resume_text = extract_pdf_text(file_path)

#         # DOCX
#         elif filename.endswith(".docx"):
#             resume_text = extract_docx_text(file_path)

#         else:
#             continue

#         # Calculate score
       
#         score = calculate_score(resume_text, jd_text)

#         # Extract resume skills
#         resume_skills = extract_skills(
#             resume_text
#         )

#         # Matching skills
#         matched_skills = list(
#             set(jd_skills) &
#             set(resume_skills)
#         )

#         # Missing skills
#         missing_skills = list(
#             set(jd_skills) -
#             set(resume_skills)
#         )

#         results.append({
#             "candidate": filename,
#             "score": score,
#             "matched_skills": matched_skills,
#             "missing_skills": missing_skills
#         })

#     # Sort by score descending
#     results = sorted(
#         results,
#         key=lambda x: x["score"],
#         reverse=True
#     )

#     return {
#         "ranked_candidates": results
#     }
