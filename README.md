# 🤖 PDF Chatbot using React, Flask, LangChain & HuggingFace

Chat with your PDF files through an intelligent AI chatbot interface. This full-stack application allows you to upload any PDF, ask questions, and receive answers grounded in the document content — all in a clean, user-friendly React frontend.

---

## 🚀 Features

- 🧾 Upload any PDF file and extract its content
- 🔍 Semantic search using vector embeddings (MiniLM)
- 🧠 Smart answering with `Mistral-7B-Instruct` via HuggingFace Inference API
- 🖥️ Full-stack setup: **React frontend** + **Flask API backend**
- 📁 Persistent document store using ChromaDB
- ⚙️ Built with LangChain for LLM chaining and retrieval

---

## 🧰 Tech Stack

### 🔹 Frontend
- **React**
- **Axios** for HTTP requests
- **File Upload UI** for PDFs
- **Chat Interface** for interacting with AI

### 🔹 Backend
- **Flask** – Python API server
- **LangChain** – Context-aware query processing
- **HuggingFace Transformers** – LLM and embeddings
- **ChromaDB** – Vector store for document chunks

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pdf-chatbot.git
cd pdf-chatbot
npm i # to get node modules
```

For backend - 
```
cd backend
python -m venv env # creating an environment
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
```


To run flask server - python app.py
To run react setup - npm run dev


Made with ❤️ by Shalini Mishra

