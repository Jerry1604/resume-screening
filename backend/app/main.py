from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import resume_routes
from app.routes import file_routes
from app.routes import jd_routes
# from app.routes import score_routes
from app.routes import scoring_routes




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(resume_routes.router)
app.include_router(file_routes.router)
app.include_router(jd_routes.router)
# app.include_router(score_routes.router)
app.include_router(scoring_routes.router)




@app.get("/")
def home():
    return {"message": "Backend is running clean 🚀"}