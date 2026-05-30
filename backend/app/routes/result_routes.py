# from fastapi import APIRouter
# from app.services.scoring_service import calculate_score

# router = APIRouter()

# @router.post("/score")
# def score_resume(data: dict):

#     resume_text = data["resume"]
#     jd_text = data["jd"]

#     score = calculate_score(resume_text, jd_text)

#     return {
#         "score": score,
#         "message": "Scoring completed"
#     }