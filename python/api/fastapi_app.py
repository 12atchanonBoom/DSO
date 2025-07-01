import sys
import os
import traceback
import shutil
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from scripts.check_runner import run_check_from_api

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

app = FastAPI()

# ✅ CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-check/")
async def run_check(
    file: UploadFile = File(...),
    category: str = Form(...),
    size_filter: str = Form(None)  # ✅ เพิ่มตรงนี้
):
    try:
        # ✅ Save uploaded file
        temp_dir = "temp_files"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ Run checker
        result = run_check_from_api(temp_path, category, size_filter)
        return {
            "status": "checked",
            "category": category,
            "results": result
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
