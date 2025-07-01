# scripts/check_runner.py
from .text_data_client import fetch_targets_by_category
from .text_checker_core import run_pdf_ocr_check

def run_check_from_api(pdf_path, category: str, size_filter: str = None):
    targets = fetch_targets_by_category(category)
    if not targets:
        return {"error": f"No targets found for category '{category}'"}

    # ✅ กรองตาม size group พร้อมรองรับ NULL (ไม่มีการกำหนด group)
    if size_filter == '>278.75':
        targets = [t for t in targets if t.get('size_group_id') in (None, 1)]
    elif size_filter == '<278.75':
        targets = [t for t in targets if t.get('size_group_id') in (None, 2)]

    result = run_pdf_ocr_check(pdf_path, targets)
    return result
