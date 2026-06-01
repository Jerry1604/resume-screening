from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    score = Column(Float)

    experience_label = Column(String)
    education = Column(String)

    matched_skills = Column(Text)
    missing_skills = Column(Text)

    resume_preview = Column(Text)