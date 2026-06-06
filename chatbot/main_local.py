# ##########################
# # LOCAL RAG CHATBOT ########
# ##########################
import os
import faiss
import numpy as np
import PyPDF2
import asyncio
import requests
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
import json

# -------------------- Load environment variables --------------------
load_dotenv()

# Configurable constants
PDF_FILE_PATH = os.getenv("FILE_PATH", "")  # your single PDF file
TTS_URL = os.getenv("TTS_URL", "")
FASTAPI_PORT = int(os.getenv("FASTAPI_PORT", 8000))
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:12b")  # phi3, llama3.2:3b, gemma2:2b

# CORS (adjust if needed)
ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://54.79.126.219:5173",
    "http://54.79.126.219:3000",
    "https://portfolio-gray-xi-48.vercel.app/",
    "https://sriharan.vercel.app/"
]

# -------------------- FastAPI app --------------------
app = FastAPI(title="Local RAG Chatbot")

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
    model: Optional[str] = OLLAMA_MODEL  # Allow overriding model per request

class ChatResponse(BaseModel):
    response_text: str
    model_used: str
    audio_url: Optional[str] = None

class ModelInfo(BaseModel):
    name: str
    size: str
    modified_at: str

class HealthResponse(BaseModel):
    status: str
    rag_ready: bool
    ollama_available: bool
    available_models: List[ModelInfo]

# -------------------- Global Variables --------------------
documents: List[str] = []
index = None
embedder = None

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
    print("#############", chunks)
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


def get_ollama_response(prompt: str, model: str, max_tokens=300) -> str:
    """Get response from local Ollama model"""
    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": max_tokens,
                    "top_p": 0.9,
                    "top_k": 40
                }
            },
            timeout=120
        )
        response.raise_for_status()
        result = response.json()
        return result.get("response", "").strip()
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot connect to Ollama at {OLLAMA_URL}. Is Ollama running?"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")


def check_ollama_health() -> (bool, List[ModelInfo]):
    """Check if Ollama is running and get available models"""
    try:
        response = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        response.raise_for_status()
        models_data = response.json().get("models", [])

        models = [
            ModelInfo(
                name=model["name"],
                size=str(model.get("size", "unknown")),
                modified_at=model.get("modified_at", "unknown")
            )
            for model in models_data
        ]

        return True, models
    except:
        return False, []


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
        response = requests.post(f"{TTS_URL}/tts", json=payload, timeout=3)
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
    global embedder
    print("🚀 Initializing local RAG chatbot...")

    # Load smaller embedding model
    try:
        embedder = SentenceTransformer("paraphrase-MiniLM-L3-v2")
        print("✅ Loaded small embedding model (MiniLM-L3-v2).")
    except Exception as e:
        print(f"❌ Error loading embedding model: {e}")
        embedder = None

    # Check if Ollama is available
    ollama_available, models = check_ollama_health()
    if ollama_available:
        print(f"✅ Ollama is running with {len(models)} models available")
        if models:
            print(f"   Using model: {models[0].name}")
    else:
        print(f"❌ Ollama not available at {OLLAMA_URL}")
        print("   Please install Ollama: https://ollama.ai/")
        print(f"   Then run: ollama pull {OLLAMA_MODEL}")

    # Build FAISS index for the single PDF
    if os.path.exists(PDF_FILE_PATH):
        build_faiss_index_from_file(PDF_FILE_PATH)
    else:
        print(f"⚠️ PDF file not found: {PDF_FILE_PATH}")


# -------------------- Chat Endpoint --------------------
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if index is None:
        raise HTTPException(status_code=503, detail="FAISS index missing. Check PDF file.")

    # Check if Ollama is available
    ollama_available, _ = check_ollama_health()
    if not ollama_available:
        raise HTTPException(
            status_code=503,
            detail=f"Ollama not available at {OLLAMA_URL}. Please install and start Ollama."
        )

    user_input = request.user_input
    model_to_use = request.model or OLLAMA_MODEL

    # Retrieve relevant context
    context = "\n".join(retrieve_context(user_input))

    # Create a context-aware prompt
    prompt = (
        "You are a helpful assistant. Based on the provided context, answer the user's question. "
        "If the context doesn't contain the answer, say so politely. "
        "Keep your answers concise and to the point.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {user_input}\n\n"
        "Answer:"
    )

    # Get response from local model
    try:
        answer = get_ollama_response(prompt, model_to_use)

        # Normalize text if needed
        answer = normalize_text_case(answer)

        # Optional TTS
        # audio_url, _ = convert_text_to_speech(answer)

        return ChatResponse(
            response_text=answer,
            model_used=model_to_use,
            audio_url="audio_url"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------- Health Check --------------------
@app.get("/health", response_model=HealthResponse)
async def health_check():
    ollama_available, models = check_ollama_health()
    return HealthResponse(
        status="OK",
        rag_ready=index is not None,
        ollama_available=ollama_available,
        available_models=models
    )


# -------------------- Models Endpoint --------------------
@app.get("/models")
async def list_models():
    """List available Ollama models"""
    ollama_available, models = check_ollama_health()
    if not ollama_available:
        raise HTTPException(
            status_code=503,
            detail=f"Ollama not available at {OLLAMA_URL}"
        )
    return {"models": models}


# -------------------- Main --------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"\n📝 Instructions:")
    print(f"1. Install Ollama: https://ollama.ai/")
    print(f"2. Pull a model: ollama pull {OLLAMA_MODEL}")
    print(f"3. Start Ollama service")
    print(f"4. Server running on http://localhost:{port}\n")

    uvicorn.run("main_local:app", host="0.0.0.0", port=port)