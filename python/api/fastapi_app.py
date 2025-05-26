from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PDFInput(BaseModel):
    pdfData: str  # ในอนาคตคุณจะรับ base64 PDF ผ่านตรงนี้

@app.get("/")
def root():
    return {"message": "Vispectra OCR API is running ✅"}

@app.post("/check-ocr")
def check_ocr(data: PDFInput):
    # ตัวอย่าง mock response
    return {"status": "success", "result": f"Received {len(data.pdfData)} characters."}
