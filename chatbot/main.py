# import os
# import json
# import faiss
# import numpy as np
# import PyPDF2
# import docx
# from datetime import datetime
# from sentence_transformers import SentenceTransformer
# import google.genai # <--- Changed from openai

# # -------------------- Gemini API Key and Client --------------------
# # Replace with your actual Gemini API Key
# GEMINI_API_KEY = "" # e.g., os.environ.get("GEMINI_API_KEY")

# try:
#     # Initialize the Gemini Client
#     client = google.genai.Client(api_key=GEMINI_API_KEY)
# except Exception as e:
#     print(f"Error initializing Gemini client: {e}")
#     print("Please ensure you have the 'google-genai' library installed and a valid API key.")
#     exit()

# # -------------------- Tools (Remains the same but not used in the final chat logic) --------------------
# tools = {
#     "get_current_date": lambda: str(datetime.today().date()),
#     "get_current_time": lambda: datetime.now().strftime("%H:%M:%S"),
#     "add_numbers": lambda x, y: x + y,
#     "reverse_string": lambda text: text[::-1]
# }

# def process_tool_call(response_text):
#     # This tool processing logic is typically for complex function calling setups,
#     # which are not directly implemented in the simple RAG chat loop below.
#     try:
#         call = json.loads(response_text)
#         tool_name = call.get("tool")
#         args = call.get("args", {})
#         if tool_name in tools:
#             return str(tools[tool_name](**args))
#         return "Unknown tool"
#     except Exception:
#         return None

# # -------------------- Document Loading --------------------
# def load_pdf(file_path):
#     text = ""
#     try:
#         with open(file_path, "rb") as f:
#             reader = PyPDF2.PdfReader(f)
#             for page in reader.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#     except Exception as e:
#         print(f"Error loading PDF {file_path}: {e}")
#         return ""
#     return text.strip()

# def load_docx(file_path):
#     try:
#         doc = docx.Document(file_path)
#         return "\n".join([para.text for para in doc.paragraphs]).strip()
#     except Exception as e:
#         print(f"Error loading DOCX {file_path}: {e}")
#         return ""

# def load_documents_from_folder(folder_path):
#     documents = []
#     if not os.path.exists(folder_path):
#         print(f"Error: Folder path '{folder_path}' does not exist.")
#         return documents

#     for filename in os.listdir(folder_path):
#         full_path = os.path.join(folder_path, filename)
#         if filename.endswith(".pdf"):
#             documents.append(load_pdf(full_path))
#         elif filename.endswith(".docx"):
#             documents.append(load_docx(full_path))
#     return [doc for doc in documents if doc] # Filter out empty documents

# # -------------------- Embeddings & FAISS --------------------
# # This part remains the same as SentenceTransformer is framework-agnostic
# embedder = SentenceTransformer("all-MiniLM-L6-v2")

# def chunk_text(text, chunk_size=500, overlap=50):
#     chunks = []
#     start = 0
#     while start < len(text):
#         end = start + chunk_size
#         chunks.append(text[start:end])
#         start += chunk_size - overlap
#     return chunks

# # --- Initialization of RAG components ---
# folder_path = "uploaded_file"  # put your PDFs/DOCs here
# raw_docs = load_documents_from_folder(folder_path)

# if not raw_docs:
#     print("No documents were loaded. Please check the 'uploaded_file' folder and file types.")
#     exit()

# documents = []
# for doc in raw_docs:
#     documents.extend(chunk_text(doc))

# # Create embeddings and FAISS index
# doc_embeddings = embedder.encode(documents)
# doc_embeddings = np.array(doc_embeddings, dtype=np.float32)
# index = faiss.IndexFlatL2(doc_embeddings.shape[1])
# index.add(doc_embeddings)
# print("Embeddings and FAISS index created!")

# def retrieve_context(query, k=2):
#     query_embedding = embedder.encode([query]).astype(np.float32)
#     distances, indices = index.search(query_embedding, k)
#     return [documents[i] for i in indices[0]]

# # -------------------- Chat with Gemini --------------------
# def chat_with_bot():
#     print("RAG Chatbot started (using Gemini). Type 'quit' to exit.\n")
#     while True:
#         user_input = input("You: ")
#         if user_input.lower() in ["quit", "exit"]:
#             break

#         # Retrieve context from documents
#         context_docs = retrieve_context(user_input)
#         context_text = "\n".join(context_docs)

#         # Build prompt
#         prompt = f"You are a very polite chatbot. Answer confidently. Use first letter capital only. " \
#                  f"Do not mention that the context is from uploaded files. " \
#                  f"Use the following context to answer the question:\n\n{context_text}\n\nQuestion: {user_input}"

#         try:
#             # Call Gemini API
#             # Swapping from openai.ChatCompletion.create to client.models.generate_content
#             response = client.models.generate_content(
#                 model="gemini-2.5-flash", # Use a fast and capable Gemini model
#                 contents=[prompt],
#                 config=google.genai.types.GenerateContentConfig(
#                     temperature=0.7
#                 )
#             )

#             bot_reply = response.text
#             print("Bot:", bot_reply)

#         except Exception as e:
#             print(f"An error occurred during API call: {e}")
#             print("Please check your API key and network connection.")

# if __name__ == "__main__":
#     chat_with_bot()


###################################################


# import os
# import docx
# import json
# import faiss
# import numpy as np
# import PyPDF2
# # import docx # DOCX support is complex in async, removed for simplicity
# from pathlib import Path
# from typing import List
# from datetime import datetime

# # FastAPI imports
# from fastapi import FastAPI, File, UploadFile, HTTPException
# from pydantic import BaseModel
# from google.genai.errors import APIError

# # AI/ML/RAG imports
# from sentence_transformers import SentenceTransformer
# import google.genai

# # -------------------- Configuration & Global State --------------------
# GEMINI_API_KEY = ""
# FOLDER_PATH = "uploaded_file"
# Path(FOLDER_PATH).mkdir(exist_ok=True) # Ensure the folder exists

# # Initialize the Gemini Client
# try:
#     client = google.genai.Client(api_key=GEMINI_API_KEY)
# except Exception as e:
#     print(f"Error initializing Gemini client: {e}")
#     print("Please ensure you have the 'google-genai' library installed and a valid API key.")
#     exit()

# # RAG State Management Class
# class RAGState:
#     """Holds the RAG components (embedder, index, and document chunks)."""
#     def __init__(self):
#         self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
#         self.index = None # faiss.IndexFlatL2
#         self.documents = [] # list of text chunks
#         self.is_ready = False

# RAG_STATE = RAGState()

# # FastAPI App Instance (Must be at the top level)
# app = FastAPI(
#     title="Gemini RAG Chatbot API",
#     description="An API for uploading documents and chatting with them using Gemini and FAISS.",
# )

# # -------------------- Utility Functions --------------------

# def load_pdf(file_path):
#     text = ""
#     try:
#         with open(file_path, "rb") as f:
#             reader = PyPDF2.PdfReader(f)
#             for page in reader.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#     except Exception as e:
#         print(f"Error loading PDF {file_path}: {e}")
#         return ""
#     return text.strip()

# def load_docx(file_path):
#     try:
#         doc = docx.Document(file_path)
#         return "\n".join([para.text for para in doc.paragraphs]).strip()
#     except Exception as e:
#         print(f"Error loading DOCX {file_path}: {e}")
#         return ""
# def load_pdf_from_file(file_object):
#     """Loads text from an UploadFile's file object (assumed PDF)."""
#     text = ""
#     try:
#         # file_object is the SpooledTemporaryFile inside UploadFile
#         reader = PyPDF2.PdfReader(file_object)
#         for page in reader.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + "\n"
#     except Exception as e:
#         print(f"Error loading PDF: {e}")
#         return ""
#     return text.strip()

# def chunk_text(text, chunk_size=500, overlap=50):
#     """Splits text into chunks with overlap."""
#     chunks = []
#     start = 0
#     text_len = len(text)
#     while start < text_len:
#         end = min(start + chunk_size, text_len)
#         chunks.append(text[start:end])
#         start += chunk_size - overlap
#     return chunks

# def build_faiss_index(raw_documents, rag_state: RAGState):
#     """Processes documents, creates embeddings, and updates the global FAISS index."""
#     all_chunks = []
#     for doc in raw_documents:
#         all_chunks.extend(chunk_text(doc))

#     rag_state.documents = all_chunks

#     if all_chunks:
#         doc_embeddings = rag_state.embedder.encode(all_chunks)
#         doc_embeddings = np.array(doc_embeddings, dtype=np.float32)

#         D = doc_embeddings.shape[1]
#         rag_state.index = faiss.IndexFlatL2(D)
#         rag_state.index.add(doc_embeddings)
#         rag_state.is_ready = True
#         return len(all_chunks)
#     else:
#         rag_state.index = None
#         rag_state.is_ready = False
#         return 0
# def load_documents_from_folder(folder_path):
#     documents = []
#     if not os.path.exists(folder_path):
#         print(f"Error: Folder path '{folder_path}' does not exist.")
#         return documents

#     for filename in os.listdir(folder_path):
#         full_path = os.path.join(folder_path, filename)
#         if filename.endswith(".pdf"):
#             documents.append(load_pdf(full_path))
#         elif filename.endswith(".docx"):
#             documents.append(load_docx(full_path))

#     return [doc for doc in documents if doc] # Filter out empty documents
# def retrieve_context(query, rag_state: RAGState, k=3):
#     """Retrieves the top k relevant text chunks from the index."""
#     if rag_state.index is None or not rag_state.is_ready:
#         return []

#     query_embedding = rag_state.embedder.encode([query]).astype(np.float32)
#     distances, indices = rag_state.index.search(query_embedding, k)

#     # Return the corresponding document chunks
#     return [rag_state.documents[i] for i in indices[0]]

# # -------------------- Pydantic Schemas for Request/Response --------------------

# class ChatRequest(BaseModel):
#     question: str

# class ChatResponse(BaseModel):
#     answer: str
#     context_chunks: List[str]

# class UploadResponse(BaseModel):
#     status: str
#     message: str
#     chunks_indexed: int

# # -------------------- Initial RAG Indexing (Optional but useful for startup) --------------------

# # This section runs ONCE when the module is imported by uvicorn
# # It attempts to build an index from any files already in the FOLDER_PATH
# print(f"Attempting initial RAG index build from '{FOLDER_PATH}'...")
# initial_raw_docs = load_documents_from_folder(FOLDER_PATH) # Using your existing function
# initial_chunks_count = build_faiss_index(initial_raw_docs, RAG_STATE)

# if RAG_STATE.is_ready:
#     print(f"Initial Index created with {initial_chunks_count} chunks.")
# else:
#     print("Initial index is EMPTY. Please upload files via the API.")

# # -------------------- API Endpoints --------------------

# @app.post("/upload_documents", response_model=UploadResponse)
# async def upload_documents(files: List[UploadFile] = File(...)):
#     """
#     Endpoint to upload PDF documents, process them, and build the RAG index.

#     **Note**: This function re-initializes the RAG state, overwriting any previous documents.
#     """
#     uploaded_texts = []

#     for file in files:
#         if file.content_type != "application/pdf":
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Unsupported file type: {file.filename}. Only PDF is supported."
#             )

#         # We need to save the file temporarily or stream its content
#         # For simplicity, we assume the file handle from UploadFile is sufficient
#         pdf_text = load_pdf_from_file(file.file)
#         if pdf_text:
#             uploaded_texts.append(pdf_text)

#     if not uploaded_texts:
#         raise HTTPException(
#             status_code=400,
#             detail="No processable text found in uploaded files. Ensure they are valid PDFs."
#         )

#     # Re-build the entire FAISS index with the new documents
#     chunks_indexed = build_faiss_index(uploaded_texts, RAG_STATE)

#     return UploadResponse(
#         status="success",
#         message=f"Successfully processed and indexed {len(uploaded_texts)} document(s).",
#         chunks_indexed=chunks_indexed
#     )

# @app.post("/chat", response_model=ChatResponse)
# async def chat_with_rag(request: ChatRequest):
#     """
#     Endpoint to ask a question against the RAG context.
#     """
#     if not RAG_STATE.is_ready:
#         raise HTTPException(
#             status_code=400,
#             detail="No documents have been indexed yet. Please upload documents first via /upload_documents."
#         )

#     user_input = request.question

#     # 1. Retrieve context
#     context_docs = retrieve_context(user_input, RAG_STATE, k=3)
#     context_text = "\n".join(context_docs)

#     # 2. Build prompt
#     prompt = f"You are a very polite chatbot. Answer confidently. Use first letter capital only. " \
#              f"Do not mention that the context is from uploaded files. " \
#              f"Use the following context to answer the question:\n\n{context_text}\n\nQuestion: {user_input}"

#     try:
#         # 3. Call Gemini API
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=[prompt],
#             config=google.genai.types.GenerateContentConfig(
#                 temperature=0.7
#             )
#         )

#         bot_reply = response.text

#         return ChatResponse(
#             answer=bot_reply,
#             context_chunks=context_docs
#         )

#     except APIError as e:
#         print(f"Gemini API Error: {e}")
#         raise HTTPException(
#             status_code=500,
#             detail="An error occurred while communicating with the Gemini API."
#         )
#     except Exception as e:
#         print(f"An unexpected error occurred: {e}")
#         raise HTTPException(
#             status_code=500,
#             detail="An unexpected error occurred on the server."
#         )

# if __name__ == "__main__":
#     import uvicorn
#     # This block is for direct execution of the script only.
#     # For uvicorn main:app --reload, the 'app' object is loaded directly.
#     print(f"Running FastAPI manually on http://127.0.0.1:8000 (Use 'uvicorn main:app --reload' for standard startup)")
#     # uvicorn.run(app, host="127.0.0.1", port=8000) # Only uncomment if NOT using the terminal command


##########################
# GOOD PROGRESS##############
##########################
import requests
import os
import faiss
import numpy as np
import PyPDF2
import docx
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
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "https://portfolio-git-latest-portfolio-sriharanvjs-projects.vercel.app/"# Alternative local development host
    # "https://your-portfolio-domain.com", # Add your live portfolio domain here
]

# Set the FastAPI server port (default is 8000 when running uvicorn)
FASTAPI_PORT = 8000

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

    return {"uploaded_files": saved_files, "message": "Files successfully saved locally."}


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
    Deletes a specific PDF or DOCX file from the local folder.
    """
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        os.remove(file_path)
        return {"message": f"File '{filename}' deleted successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting file: {e}")
# -------------------- Document Loading Functions (Moved inside for cleaner structure) --------------------


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
    # ... (same logic as before)
    documents = []
    if not os.path.exists(folder_path):
        print(
            f"Warning: Folder path '{folder_path}' does not exist. No documents loaded.")
        return documents

    for filename in os.listdir(folder_path):
        full_path = os.path.join(folder_path, filename)
        if filename.endswith(".pdf"):
            documents.append(load_pdf(full_path))
        elif filename.endswith(".docx"):
            documents.append(load_docx(full_path))
    return [doc for doc in documents if doc]


def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

# -------------------- Startup Event to Initialize RAG --------------------


def convert_text_to_speech(text):
    payload = {
        "text": text,
        "voice": "am_puck",
        "lang_code": "a",
        "speed": 1.0,
    }
    response = requests.post(f"{TTS_URL}/tts", json=payload)
    if response.status_code == 200:
        audio_path = response.json()["audio_url"]
        audio_url = f"{TTS_URL}{audio_path}"
        mouth_cues = response.json()["mouth_cues"]
        return audio_url, mouth_cues


@app.on_event("startup")
async def startup_event():
    """Initializes RAG components when the FastAPI server starts."""
    global documents, index, embedder, client

    if not client or not embedder:
        print("Initialization skipped due to missing API Key or Embedder model.")
        return

    folder_path = "uploaded_file"
    raw_docs = load_documents_from_folder(folder_path)

    if not raw_docs:
        print("No documents were loaded. RAG will not function.")
        return

    # Chunk and store documents globally
    for doc in raw_docs:
        documents.extend(chunk_text(doc))

    # Create embeddings and FAISS index
    doc_embeddings = embedder.encode(documents)
    doc_embeddings = np.array(doc_embeddings, dtype=np.float32)

    # Initialize FAISS index globally
    index_dim = doc_embeddings.shape[1]
    global index
    index = faiss.IndexFlatL2(index_dim)
    index.add(doc_embeddings)
    print("✅ Embeddings and FAISS index successfully created and loaded.")


def retrieve_context(query, k=2):
    """Retrieves relevant context chunks from the FAISS index."""
    global documents, index, embedder
    if index is None or embedder is None:
        return ["RAG system is not initialized. Cannot retrieve context."]

    query_embedding = embedder.encode([query]).astype(np.float32)
    distances, indices = index.search(query_embedding, k)
    return [documents[i] for i in indices[0]]

# -------------------- API ENDPOINT --------------------


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """The main chat endpoint that the React frontend will call."""
    global client
    if client is None:
        raise HTTPException(
            status_code=503, detail="Gemini client not initialized (API Key error).")

    if index is None:
        raise HTTPException(
            status_code=503, detail="RAG documents not loaded (missing 'uploaded_file' content).")

    user_input = request.user_input

    # 1. Retrieve context
    context_docs = retrieve_context(user_input)
    context_text = "\n".join(context_docs)

    # 2. Build prompt
    prompt = f"You are a very polite chatbot. Answer confidently and politely. Use first letter only Capital. " \
             f"Do not mention that the context is from uploaded files.And don't show the mobile number fully partially mask it " \
             f"Use the following context to answer the question:\n\n{context_text}\n\nQuestion: {user_input}"

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
        audio_url,_ = convert_text_to_speech(bot_reply)
        return ChatResponse(response_text=bot_reply, audio_url=audio_url)

    except Exception as e:
        print(f"Gemini API call error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Internal API error: Could not get response from Gemini.")

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
    # This will run the application on localhost:8000 (standard FastAPI port)
    uvicorn.run("main:app", host="0.0.0.0", port=FASTAPI_PORT, reload=True)
