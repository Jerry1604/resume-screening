from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    resume_text = Column(Text)
    score = Column(Float)
    matched_skills = Column(Text)
    missing_skills = Column(Text)