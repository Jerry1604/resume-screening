from PyPDF2 import PdfReader
from docx import Document


def extract_text(file_path):

    text = ""

    # PDF
    if file_path.endswith(".pdf"):

        reader = PdfReader(file_path)

        for page in reader.pages:

            if page.extract_text():
                text += page.extract_text()

    # DOCX
    elif file_path.endswith(".docx"):

        doc = Document(file_path)

        for para in doc.paragraphs:
            text += para.text + "\n"

    return text.lower()