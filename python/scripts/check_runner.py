# scripts/check_runner.py
from .text_data_client import fetch_targets_by_category
from .text_checker_core import run_pdf_ocr_check

def run_check_from_api(pdf_path, category: str):
    targets = fetch_targets_by_category(category)
    if not targets:
        return {"error": f"No targets found for category '{category}'"}
    
    result = run_pdf_ocr_check(pdf_path, targets)
    return result
