import sys
import os
import traceback  # ✅ เพิ่ม traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from scripts.check_runner import run_check_from_api
import shutil

app = FastAPI()

# ✅ เพิ่ม CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ใช้ "*" เฉพาะตอน dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-check/")
async def run_check(file: UploadFile = File(...), category: str = Form(...)):
    try:
        # ✅ ตรวจสอบและ log path
        temp_dir = "temp_files"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)

        # ✅ บันทึกไฟล์ PDF
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ รันเช็ค
        result = run_check_from_api(temp_path, category)
        return {
            "status": "checked",
            "category": category,
            "results": result
        }

    except Exception as e:
        traceback.print_exc()  # ✅ log error to console
        return {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
