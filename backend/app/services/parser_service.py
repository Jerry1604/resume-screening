import pdfplumber
from docx import Document
import os

def extract_pdf_text(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:
           page_text = page.extract_text()
           if page_text:
               text += page_text

    return text

def extract_docx_text(file_path):

    doc = Document(file_path)

    return "\n".join(
        [para.text for para in doc.paragraphs]
    )


def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_pdf_text(file_path)

    elif ext == ".docx":
        return extract_docx_text(file_path)

    elif ext == ".doc":
        # optional fallback (basic handling)
        return "DOC format not supported fully. Convert to DOCX."

    else:
        return ""