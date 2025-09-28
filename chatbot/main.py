##########################
# GOOD PROGRESS##############
##########################
import requests
import os
import faiss
import numpy as np
import PyPDF2
import docx
import asyncio
from sentence_transformers import SentenceTransformer
import google.genai
from fastapi import FastAPI, HTTPException, UploadFile, File
import shutil
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file (for API Key)
load_dotenv()

# -------------------- Configuration --------------------

# Define allowed origins for CORS
# ⚠️ IMPORTANT: Replace 'http://localhost:5173' with your *actual* portfolio URL(s)
# and the production URL when deploying.
ALLOWED_ORIGINS = [
    "http://localhost:5173",    # Your React/Vite development server
    "http://127.0.0.0:5173",
    "http://localhost:8080",
    "https://portfolio-git-latest-portfolio-sriharanvjs-projects.vercel.app/"# Alternative local development host
    # "https://your-portfolio-domain.com", # Add your live portfolio domain here
]

# Set the FastAPI server port (default is 8000 when running uvicorn)
# Now reads the port from the environment variable FASTAPI_PORT
FASTAPI_PORT = int(os.getenv("FASTAPI_PORT", 8000))

# Use environment variable for API Key
# Fallback to hardcoded if needed
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
TTS_URL = os.getenv("TTS_URL", "")
UPLOAD_FOLDER = "uploaded_file"

# -------------------- FastAPI App Initialization --------------------

app = FastAPI(title="RAG Chatbot API")

# Add CORS Middleware to allow your React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET)
    allow_headers=["*"],
)

# -------------------- Data Models --------------------

class ChatRequest(BaseModel):
    """Data model for the incoming chat request from the frontend."""
    user_input: str


class ChatResponse(BaseModel):
    """Data model for the outgoing chat response to the frontend."""
    response_text: str
    # Placeholder for future audio response support
    audio_url: Optional[str] = None

class IndexResponse(BaseModel):
    """Data model for the re-indexing response."""
    status: str
    message: str
    chunk_count: int

# -------------------- RAG Component Initialization --------------------


# Initialize the Gemini Client
try:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set.")
    client = google.genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    print("FATAL: Cannot initialize Gemini client. Check API key.")
    client = None

# Initialize the Sentence Transformer model
try:
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error loading Sentence Transformer: {e}")
    embedder = None


# Global RAG components
documents: List[str] = []
index: Optional[faiss.IndexFlatL2] = None

# -------------------- Utility Functions --------------------

def load_pdf(file_path):
    text = ""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error loading PDF {file_path}: {e}")
        return ""
    return text.strip()


def load_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs]).strip()
    except Exception as e:
        print(f"Error loading DOCX {file_path}: {e}")
        return ""


def load_documents_from_folder(folder_path):
    documents_list = []
    if not os.path.exists(folder_path):
        # Ensure the folder is created if it doesn't exist
        os.makedirs(folder_path, exist_ok=True)
        print(f"Info: Folder path '{folder_path}' created.")
        return documents_list

    for filename in os.listdir(folder_path):
        full_path = os.path.join(folder_path, filename)
        if filename.endswith(".pdf"):
            documents_list.append(load_pdf(full_path))
        elif filename.endswith(".docx"):
            documents_list.append(load_docx(full_path))
    return [doc for doc in documents_list if doc]


def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def convert_text_to_speech(text):
    """
    Placeholder for calling a TTS service.
    Note: Requires the TTS_URL environment variable to be set.
    """
    if not TTS_URL:
        return None, None
    if text:
        text.replace("SRIHARAN VIJAYAKUMAR", "Sriharan Vijayakumar")
    payload = {
        "text": text,
        "voice": "bm_daniel",
        "lang_code": "a",
        "speed": 1.0,
    }
    try:
        response = requests.post(f"{TTS_URL}/tts", json=payload)
        response.raise_for_status() # Raise HTTPError for bad responses
        
        response_data = response.json()
        audio_path = response_data.get("audio_url")
        mouth_cues = response_data.get("mouth_cues")
        
        if audio_path:
            audio_url = f"{TTS_URL}{audio_path}"
            return audio_url, mouth_cues
        return None, None
        
    except requests.exceptions.RequestException as e:
        print(f"TTS API call failed: {e}")
        return None, None
    except Exception as e:
        print(f"Error processing TTS response: {e}")
        return None, None

def retrieve_context(query, k=2):
    """Retrieves relevant context chunks from the FAISS index."""
    global documents, index, embedder
    if index is None or embedder is None:
        return ["RAG system is not initialized. Cannot retrieve context."]

    query_embedding = embedder.encode([query]).astype(np.float32)
    distances, indices = index.search(query_embedding, k)
    return [documents[i] for i in indices[0]]

# -------------------- Indexing Function --------------------

def build_faiss_index(folder_path):
    """Reads documents from the folder, chunks them, and builds the FAISS index."""
    global documents, index, embedder
    
    if embedder is None:
        print("Embedder not available. Cannot build index.")
        return 0

    raw_docs = load_documents_from_folder(folder_path)

    if not raw_docs:
        print("No documents found in folder to index.")
        documents = []
        index = None
        return 0

    # Chunk and store documents globally
    new_documents = []
    for doc in raw_docs:
        new_documents.extend(chunk_text(doc))
        
    documents = new_documents

    # Create embeddings and FAISS index
    doc_embeddings = embedder.encode(documents)
    doc_embeddings = np.array(doc_embeddings, dtype=np.float32)

    # Initialize FAISS index globally
    index_dim = doc_embeddings.shape[1]
    index = faiss.IndexFlatL2(index_dim)
    index.add(doc_embeddings)
    
    print(f"✅ FAISS index successfully created and loaded with {len(documents)} chunks.")
    return len(documents)

# -------------------- Startup Event to Initialize RAG --------------------

@app.on_event("startup")
async def startup_event():
    """Initializes RAG components when the FastAPI server starts."""
    # Attempt to build index from any files committed to the repo
    build_faiss_index(UPLOAD_FOLDER)

# -------------------- API ENDPOINTS --------------------

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload multiple PDF or DOCX files and store them in the local folder.
    """
    saved_files = []
    for file in files:
        try:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            # Ensure valid file extension
            if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
                continue

            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_files.append(file.filename)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to upload {file.filename}: {e}")

    if not saved_files:
        raise HTTPException(
            status_code=400, detail="No valid files were uploaded.")

    return {"uploaded_files": saved_files, "message": "Files successfully saved locally. **Remember to call /reindex next.**"}

@app.post("/reindex", response_model=IndexResponse)
async def reindex_endpoint():
    """
    Endpoint to manually trigger the RAG index creation after file changes.
    """
    try:
        chunk_count = build_faiss_index(UPLOAD_FOLDER)
        if chunk_count > 0:
            return IndexResponse(
                status="success",
                message=f"RAG index rebuilt successfully.",
                chunk_count=chunk_count
            )
        else:
             return IndexResponse(
                status="warning",
                message=f"RAG index rebuilt successfully, but 0 documents were found.",
                chunk_count=0
            )

    except Exception as e:
        print(f"Re-indexing error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to rebuild index: {e}")


@app.get("/files")
async def list_uploaded_files():
    """
    Returns a list of all uploaded PDF and DOCX files in the local folder.
    """
    try:
        files = [f for f in os.listdir(
            UPLOAD_FOLDER) if f.endswith((".pdf", ".docx"))]
        return {"uploaded_files": files, "total_files": len(files)}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/files/{filename}")
async def delete_file(filename: str):
    """
    Deletes a specific PDF or DOCX file from the local folder and triggers a reindex.
    """
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        os.remove(file_path)
        # Rebuild index immediately after deletion
        build_faiss_index(UPLOAD_FOLDER)
        return {"message": f"File '{filename}' deleted successfully and index updated."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting file: {e}")


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """The main chat endpoint that the React frontend will call."""
    global client
    if client is None:
        raise HTTPException(
            status_code=503, detail="Gemini client not initialized (API Key error).")

    if index is None:
        raise HTTPException(
            status_code=503, detail="RAG documents not loaded. Please upload documents via /upload and call /reindex.")

    user_input = request.user_input

    # 1. Retrieve context
    context_docs = retrieve_context(user_input)
    context_text = "\n".join(context_docs)

    # 2. Build prompt
    prompt = f"You are a very polite chatbot. Answer confidently and politely. Use first letter only Capital. " \
             f"Do not mention that the context is from uploaded files.And don't show the mobile number fully partially mask it " \
             f"Use the following context to answer the question:\n\n{context_text}\n\nQuestion: {user_input}"

    MAX_RETRIES = 5
    for attempt in range(MAX_RETRIES):
        try:
            # 3. Call Gemini API
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt],
                config=google.genai.types.GenerateContentConfig(
                    temperature=0.7
                )
            )

            bot_reply = response.text
            audio_url, _ = convert_text_to_speech(bot_reply)
            return ChatResponse(response_text=bot_reply, audio_url=audio_url)

        except Exception as e:
            print(f"Gemini API call error (Attempt {attempt + 1}/{MAX_RETRIES}): {e}")
            
            # If it's the last attempt, raise the HTTPException
            if attempt == MAX_RETRIES - 1:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Internal API error: Could not get response from Gemini after {MAX_RETRIES} attempts. Error: {e}"
                )

            # Calculate exponential backoff delay (1s, 2s, 4s, 8s, 16s...)
            delay = 2 ** attempt
            print(f"Retrying in {delay} seconds...")
            await asyncio.sleep(delay)


# -------------------- Health Check --------------------


@app.get("/health")
async def health_check():
    """Simple endpoint to check if the API is running."""
    status = "OK"
    if client is None:
        status = "Gemini_API_Key_Error"
    if index is None:
        status = "RAG_Docs_Missing"
    return {"status": status, "rag_initialized": index is not None}

# -------------------- How to Run --------------------
if __name__ == "__main__":
    import uvicorn
    # Use the $PORT environment variable if available (for deployment), otherwise use the default
    port = int(os.environ.get("PORT", FASTAPI_PORT)) 
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
