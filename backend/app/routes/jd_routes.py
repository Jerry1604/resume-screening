from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter()

JD_DIR = "app/uploads/jd"
os.makedirs(JD_DIR, exist_ok=True)


#  Manual JD
@router.post("/jd/manual")
def save_jd(data: dict):

    jd_text = data.get("jd")

    file_path = os.path.join(JD_DIR, "jd.txt")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(jd_text)

    return {"message": "JD saved successfully"}

@router.post("/jd/upload")
async def upload_jd(file: UploadFile = File(...)):

    file_path = os.path.join(JD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "JD file uploaded",
        "filename": file.filename
    }