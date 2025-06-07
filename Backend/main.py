from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import fitz
import easyocr
import re
from rapidfuzz import fuzz

app = FastAPI()

# เปิด CORS ให้ Angular เชื่อมต่อได้ (เปลี่ยน URL ถ้ารันไม่ใช่ localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DPI = 500
KEYWORDS = [
    "MADE IN THAILAND",
    "HECHO EN TAILANDIA",
    "FABRIQUÉ EN THAÏLANDE",
    "Imported by",
    "Importé par: Mattel Canada Inc., Mississauga, Ontario L5R 3W2",
    "Manufactured, imported or distributed by",
    "Mattel Europa B.V.",
    "Gondel 1",
    "1186 MJ Amstelveen",
    "Nederland",
    "GUARDAR PARA EVENTUAIS CONSULTAS",
    "CONFORMS TO",
    "CONFORME AUX NORMES DE SÉCURITÉ DE",
    "CUMPLE CON LAS NORMAS DE SEGURIDAD DE",
    "ASTM F963",
]
BOLD_KEYWORDS = {
    "MADE IN THAILAND",
    "HECHO EN TAILANDIA",
    "FABRIQUÉ EN THAÏLANDE",
}

def pt_to_mm(pt):
    return (pt / 72) * 25.4

def get_box_height_mm(bbox):
    if isinstance(bbox, (list, tuple)):
        if len(bbox) == 4 and all(isinstance(pt, (list, tuple)) and len(pt) == 2 for pt in bbox):
            ys = [pt[1] for pt in bbox]
            height_px = max(ys) - min(ys)
        elif len(bbox) == 4 and all(isinstance(pt, (int, float)) for pt in bbox):
            height_px = bbox[3] - bbox[1]
        else:
            raise ValueError(f"Unknown bbox format: {bbox}")
    else:
        raise TypeError(f"bbox must be list or tuple, got {type(bbox)}")
    return (height_px / DPI) * 25.4

@app.post("/api/check-pdf/")
async def check_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp.pdf", "wb") as f:
        f.write(contents)

    doc = fitz.open("temp.pdf")
    reader = easyocr.Reader(['en', 'fr', 'es', 'pt'])

    results_final = []

    for page_num, page in enumerate(doc, start=1):
        spans = []
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if "lines" in block:
                for line in block["lines"]:
                    for span in line["spans"]:
                        spans.append({
                            "text": span["text"],
                            "flags": span.get("flags", 0),
                            "size": span.get("size", 0),
                            "bbox": span.get("bbox", (0,0,0,0)),
                        })
        img = page.get_pixmap(dpi=DPI)
        img_path = f"_temp_page_{page_num}.png"
        img.save(img_path)
        ocr_results = reader.readtext(img_path, detail=1)

        for kw in KEYWORDS:
            kw_norm = re.sub(r'[\s,./]+', '', kw.lower())
            found = False
            is_bold_text = False
            size_vals = []

            # ตรวจสอบใน Text Layer
            for span in spans:
                span_norm = re.sub(r'[\s,./]+', '', span["text"].lower())
                if fuzz.partial_ratio(kw_norm, span_norm) >= 80:
                    found = True
                    size_vals.append(pt_to_mm(span["size"]))
                    if kw in BOLD_KEYWORDS and (span["flags"] & 2) != 0:
                        is_bold_text = True

            # ถ้าไม่เจอตัวหนาใน Text Layer ให้ตรวจ OCR ประเมินความหนาจากความสูงกล่อง
            if kw in BOLD_KEYWORDS and not is_bold_text:
                for box, text, conf in ocr_results:
                    text_norm = re.sub(r'[\s,./]+', '', text.lower())
                    if fuzz.partial_ratio(kw_norm, text_norm) >= 80:
                        height_mm = get_box_height_mm(box)
                        if height_mm >= 3.0:
                            is_bold_text = True
                            found = True
                            size_vals.append(height_mm)

            # สำหรับ keyword ที่ไม่ต้องตรวจตัวหนา ให้เก็บขนาด OCR ด้วย
            if kw not in BOLD_KEYWORDS:
                for box, text, conf in ocr_results:
                    text_norm = re.sub(r'[\s,./]+', '', text.lower())
                    if fuzz.partial_ratio(kw_norm, text_norm) >= 80:
                        found = True
                        size_vals.append(get_box_height_mm(box))

            avg_size = round(sum(size_vals)/len(size_vals), 2) if size_vals else None

            results_final.append({
                "keyword": kw,
                "found": found,
                "bold": is_bold_text if kw in BOLD_KEYWORDS else None,
                "size_mm": avg_size,
                "page": page_num,
            })

    doc.close()

    # รวมผลให้เหลือรายการสุดท้ายของแต่ละ keyword
    final_result = {}
    for item in results_final:
        final_result[item["keyword"]] = item

    return JSONResponse(content={"status": "success", "message": "ตรวจ PDF เสร็จแล้ว", "data": list(final_result.values())})
