# scripts/text_checker_core.py

import fitz
import re
import difflib

def normalize_text(text):
    text = re.sub(r'[.,!?]', '', text)
    return re.sub(r'\s+', ' ', text.strip().lower())

def normalize_text_for_similarity(text):
    return normalize_text(text)

def is_all_caps(text):
    letters = [c for c in text if c.isalpha()]
    return all(c.isupper() for c in letters) if letters else False

def compare_similarity(a, b):
    return difflib.SequenceMatcher(None, a, b).ratio() * 100

def check_char_size(found_spans, check_char, min_size_mm):
    for span in found_spans:
        span_text = span["text"]
        size_mm = span["size"] * 0.352778
        if check_char == "ALL":
            if any((span["size"] * 0.352778) >= min_size_mm for c in span_text):
                return True
        else:
            if check_char in span_text.lower():
                for c in span_text:
                    if c.lower() == check_char and size_mm >= min_size_mm:
                        return True
    return False

# ✅ Core function
def run_pdf_ocr_check(pdf_path, target_texts):
    doc = fitz.open(pdf_path)
    results = []

    for page_num, page in enumerate(doc, start=1):
        page_text = page.get_text()
        norm_page_text = normalize_text(page_text)
        words = norm_page_text.split()

        all_spans = []
        for block in page.get_text("dict")["blocks"]:
            if block.get("type", 0) == 0:
                for line in block["lines"]:
                    for span in line["spans"]:
                        all_spans.append(span)

        for t in target_texts:
            text = t["text"]
            text_id = t.get("id", None)
            text_norm = normalize_text_for_similarity(text)

            found = text_norm in norm_page_text

            best_match = ""
            best_score = 0
            window_size = len(text_norm.split())
            for i in range(len(words) - window_size + 1):
                segment = " ".join(words[i:i + window_size])
                score = compare_similarity(text_norm, segment)
                if score > best_score:
                    best_score = score
                    best_match = segment

            case_ok = is_all_caps(best_match) if t.get("all_caps") else True

            rects = page.search_for(text)
            bold_ok = underline_ok = None
            char_check_ok = None
            x = y = None

            if rects:
                r = rects[0]
                x, y = r.x0, r.y0

                found_spans = [span for span in all_spans if fitz.Rect(span["bbox"]).intersects(r)]
                for span in found_spans:
                    if span.get("flags", 0) & 2:
                        bold_ok = True
                    if span.get("flags", 0) & 4:
                        underline_ok = True

                if t.get("check_char") and t.get("min_size_mm"):
                    char_check_ok = check_char_size(found_spans, t["check_char"], t["min_size_mm"])

            results.append({
                "text_id": text_id,
                "target_text": text,
                "best_match": best_match,
                "page_no": page_num,
                "is_found": int(found),
                "found_status": "✅ Found" if found else "❌ Not Found",
                "case_ok": int(case_ok),
                "bold_ok": bool(bold_ok) if bold_ok is not None else None,
                "underline_ok": bool(underline_ok) if underline_ok is not None else None,
                "char_check_ok": bool(char_check_ok) if char_check_ok is not None else None,
                "x": x,
                "y": y
            })

    return results
