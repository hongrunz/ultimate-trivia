#!/usr/bin/env python3
"""
Validate GEMINI_API_KEY by making a minimal Gemini API call.
Run from project root: python backend/check_gemini_key.py
Or from backend: python check_gemini_key.py
"""
import os
import sys

# Add backend to path and load .env from backend/
_script_dir = os.path.dirname(os.path.abspath(__file__))
_backend_env = os.path.join(_script_dir, ".env")
if os.path.isfile(_backend_env):
    from dotenv import load_dotenv
    load_dotenv(_backend_env, override=True)

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("GEMINI_MODEL_NAME", "gemini-3-flash-preview")

if not api_key:
    print("FAIL: GEMINI_API_KEY is not set in backend/.env")
    sys.exit(1)

print(f"Checking Gemini API key (model: {model})...")
print("(Key is set; not printing value for security.)")

try:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    resp = client.models.generate_content(
        model=model,
        contents=[types.Content(role="user", parts=[types.Part.from_text(text="Reply with exactly: OK")])],
    )
    text = (getattr(resp, "text", None) or "").strip()
    if "OK" in text or text:
        print("OK: Gemini API key is valid. You can generate questions.")
    else:
        print("WARN: API responded but with empty text. Key may still work.")
except Exception as e:
    err = str(e).lower()
    if "api key" in err or "invalid" in err or "401" in err or "403" in err:
        print("FAIL: Gemini API key is invalid or rejected.")
        print("Get a key at: https://aistudio.google.com/app/apikey")
        print("Then set GEMINI_API_KEY in backend/.env")
    else:
        print(f"FAIL: {e}")
    sys.exit(1)
