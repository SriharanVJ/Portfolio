# ##########################
# # GOOD PROGRESS##############
# ##########################
import os
import faiss
import numpy as np
import PyPDF2
import asyncio
import requests
from sentence_transformers import SentenceTransformer
import google.genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv

# -------------------- Load environment variables --------------------
load_dotenv()

# Configurable constants
PDF_FILE_PATH = os.getenv("FILE_PATH", "")  # your single PDF file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
TTS_URL = os.getenv("TTS_URL", "")
FASTAPI_PORT = int(os.getenv("FASTAPI_PORT", 8000))

# CORS (adjust if needed)
# CORS (adjust if needed)
ALLOWED_ORIGINS = [
    "http://localhost:8080",  # <--- ADD THIS LINE
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://portfolio-gray-xi-48.vercel.app/",
    "https://sriharan.vercel.app/"
]

# -------------------- FastAPI app --------------------
app = FastAPI(title="Lightweight RAG Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Data Models --------------------
class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    response_text: str
    audio_url: Optional[str] = None

# -------------------- Global Variables --------------------
documents: List[str] = []
index = None
embedder = None
client = None

# -------------------- Utility Functions --------------------
def load_pdf(file_path: str) -> str:
    text = ""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                content = page.extract_text()
                if content:
                    text += content + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text.strip()


def chunk_text(text: str, chunk_size=1000, overlap=100) -> List[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def build_faiss_index_from_file(file_path: str):
    global documents, index, embedder
    print("📘 Building FAISS index from PDF...")

    text = load_pdf(file_path)
    if not text:
        raise RuntimeError("No text could be extracted from PDF.")

    chunks = chunk_text(text)
    print("#############",chunks)
    documents = chunks

    embeddings = embedder.encode(chunks)
    embeddings = np.array(embeddings, dtype=np.float32)

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    print(f"✅ FAISS index built with {len(chunks)} chunks.")


def retrieve_context(query: str, k=1) -> List[str]:
    if index is None or embedder is None:
        return ["RAG index not initialized."]
    query_embedding = embedder.encode([query]).astype(np.float32)
    _, indices = index.search(query_embedding, k)
    return [documents[i] for i in indices[0]]


def convert_text_to_speech(text: str):
    if not TTS_URL:
        return None, None
    payload = {
        "text": text,
        "voice": "bm_daniel",
        "lang_code": "a",
        "speed": 1.0,
    }
    try:
        response = requests.post(f"{TTS_URL}/tts", json=payload)
        response.raise_for_status()
        data = response.json()
        audio_path = data.get("audio_url")
        if audio_path:
            return f"{TTS_URL}{audio_path}", data.get("mouth_cues")
        return None, None
    except Exception as e:
        print(f"TTS error: {e}")
        return None, None


def normalize_text_case(text: str) -> str:
    """Normalize all-uppercase responses into normal sentence case."""
    if not text:
        return text
    # If the entire text is in uppercase, convert to proper sentence case
    if text.isupper():
        return text.capitalize()
    # If multiple sentences, normalize each
    sentences = [s.strip().capitalize() for s in text.split(".") if s.strip()]
    return ". ".join(sentences) + ("." if text.endswith(".") else "")


# -------------------- Startup --------------------
@app.on_event("startup")
async def startup_event():
    global client, embedder
    print("🚀 Initializing lightweight RAG chatbot...")

    # Initialize Gemini
    try:
        if not GEMINI_API_KEY:
            raise ValueError("Missing GEMINI_API_KEY")
        client = google.genai.Client(api_key=GEMINI_API_KEY)
        print("✅ Gemini client ready.")
    except Exception as e:
        print(f"❌ Gemini init error: {e}")
        client = None

    # Load smaller embedding model
    try:
        embedder = SentenceTransformer("paraphrase-MiniLM-L3-v2")
        print("✅ Loaded small embedding model (MiniLM-L3-v2).")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        embedder = None

    # Build FAISS index for the single PDF
    if os.path.exists(PDF_FILE_PATH):
        build_faiss_index_from_file(PDF_FILE_PATH)
    else:
        print(f"⚠️ PDF file not found: {PDF_FILE_PATH}")


# -------------------- Chat Endpoint --------------------
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    global client
    if client is None:
        raise HTTPException(status_code=503, detail="Gemini not initialized.")
    if index is None:
        raise HTTPException(status_code=503, detail="FAISS index missing. Check PDF file.")

    user_input = request.user_input
    context = "\n".join(retrieve_context(user_input))

    prompt = (
        "You are a polite assistant. Answer the user's question directly and confidently, "
        "as if the information is your own knowledge. **DO NOT mention the context, the document, or the source of your information.**\n\n"
        f"Context:\n{context}\n\nQuestion: {user_input}"
    )

    MAX_RETRIES = 3
    for attempt in range(MAX_RETRIES):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
                config=google.genai.types.GenerateContentConfig(temperature=0.7)
            )
            answer = response.text.strip()

            # ✅ Fix uppercase responses
            answer = normalize_text_case(answer)

            audio_url, _ = convert_text_to_speech(answer)
            return ChatResponse(response_text=answer, audio_url=audio_url)
        except Exception as e:
            print(f"Gemini error (attempt {attempt + 1}): {e}")
            if attempt == MAX_RETRIES - 1:
                raise HTTPException(status_code=500, detail=f"Gemini API failed: {e}")
            await asyncio.sleep(2 ** attempt)


# -------------------- Health Check --------------------
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "gemini_ready": client is not None,
        "rag_ready": index is not None
    }


# -------------------- Main --------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
