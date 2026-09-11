#!/usr/bin/env python3
import sys
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Chyba: GEMINI_API_KEY není nastaven v .env")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Použití: python3 generate_image.py \"váš prompt\" [aspect_ratio]")
    print("  aspect_ratio: 1:1, 3:4, 4:3, 9:16, 16:9 (výchozí: 1:1)")
    sys.exit(1)

# Pokud poslední argument vypadá jako aspect ratio (obsahuje ':'), použij ho
VALID_RATIOS = {"1:1", "3:4", "4:3", "9:16", "16:9"}
if len(sys.argv) > 2 and sys.argv[-1] in VALID_RATIOS:
    aspect_ratio = sys.argv[-1]
    prompt = " ".join(sys.argv[1:-1])
else:
    aspect_ratio = "1:1"
    prompt = " ".join(sys.argv[1:])

from google import genai
from google.genai import types

client = genai.Client(api_key=api_key)

print(f"Generuji obrázek pro prompt: {prompt}")
print(f"Aspect ratio: {aspect_ratio}")

response = client.models.generate_images(
    model="imagen-4.0-generate-001",
    prompt=prompt,
    config=types.GenerateImagesConfig(number_of_images=1, aspect_ratio=aspect_ratio),
)

os.makedirs("images", exist_ok=True)

timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
filename = f"images/image_{timestamp}.png"

image_data = response.generated_images[0].image.image_bytes
with open(filename, "wb") as f:
    f.write(image_data)

print(f"Obrázek uložen: {filename}")
