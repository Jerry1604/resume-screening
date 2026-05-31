from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}

def is_allowed_file(filename: str):
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)


@router.post("/upload-resumes")
async def upload_resumes(files: list[UploadFile] = File(...)):



    uploaded_files = []
    failed_files = []
    success_messages = []

    for file in files:
        try:

            # Validate filename
            if not file.filename:
                raise ValueError("Empty filename")

            # Validate extension
            if not is_allowed_file(file.filename):
                raise ValueError("Only PDF, DOC, DOCX allowed")

            file_path = os.path.join(UPLOAD_DIR, file.filename)

            #  Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            uploaded_files.append(file.filename)

            # Success message per file
            success_messages.append(f"{file.filename} uploaded successfully")

        except Exception as e:
            failed_files.append({
                "file": file.filename,
                "error": str(e)
            })

    return {
        "message": "Upload process completed",
        "success_messages": success_messages,
        "uploaded_count": len(uploaded_files),
        "failed_count": len(failed_files),
        "uploaded_files": uploaded_files,
        "failed_files": failed_files
    }