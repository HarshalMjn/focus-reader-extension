from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI()

# Load environment variables
import os  # Added missing import
from dotenv import load_dotenv
load_dotenv()  # Load environment variables

# Enable CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Define request model
class TextRequest(BaseModel):
    text: str

@app.post("/summarize")
async def summarize_text(request: TextRequest):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")  # Use the correct model
        response = model.generate_content(f"Summarize this article:\n{request.text}")
        summary = response.text
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
