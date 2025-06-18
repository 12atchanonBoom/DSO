# scripts/text_data_client.py
import requests

def fetch_targets_by_category(category):
    # ใช้ path ตาม backend ที่ mount ไว้ที่ /api/texts
    url = f"http://localhost:3000/api/texts/target-texts/{category}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
