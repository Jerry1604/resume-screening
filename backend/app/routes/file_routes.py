from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.get("/get-file/{filename}")
def get_file(filename: str):

    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    return FileResponse(file_path)

@router.get("/list-files")
def list_files():

    files = os.listdir(UPLOAD_DIR)

    return {
        "files": files
    }