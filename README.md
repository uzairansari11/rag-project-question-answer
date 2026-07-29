# RAG Project — AI Document Intelligence & Content Generation Engine

A high-performance **Retrieval-Augmented Generation (RAG)** backend built with **Node.js, Express, Prisma (PostgreSQL), Qdrant, BullMQ, and OpenAI**. 

This platform enables users to upload documents (PDF/TXT), organize them into collections, execute context-aware RAG search and chat streams, and automatically generate study **Flashcards** and multi-speaker **Audio Podcasts** from their uploaded materials.

---

## 🚀 Key Features

* 🔐 **Authentication & User Management**: Secure JWT authentication with role-based access control (User / Admin).
* 📁 **Collection & Document Management**: Upload and store documents with background processing and status tracking.
* ⚡ **Automated Ingestion Pipeline**:
  * Text extraction from PDFs and plain text files.
  * Smart chunking using LangChain (`RecursiveCharacterTextSplitter`).
  * High-dimensional vector embedding generation (`text-embedding-3-small`).
  * Indexing into **Qdrant Vector DB** with multi-tenant payload filters (`userId`, `documentId`).
* 💬 **History-Aware RAG Chat**:
  * Guardrail classification for safe input handling.
  * Query rewriting, sub-query generation, and step-back prompts for advanced retrieval.
  * Cohere Reranking (`rerank-v3.5`) for maximum context precision.
  * Streaming responses powered by OpenAI (`gpt-4.1-mini`).
* 🎴 **AI Flashcard Generator**: Background worker generating structured flashcard sets from processed documents.
* 🎙️ **AI Podcast Studio**: 
  * Generates dialogue scripts between hosts.
  * Converts script segments into speech using OpenAI TTS.
  * Merges audio segments using **FFmpeg**.
  * Stores script and final MP3 audio securely in **AWS S3** with presigned URL delivery.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Runtime & Framework** | Node.js (ES Modules), Express.js |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Vector Database** | Qdrant Vector Search |
| **Queue & Cache** | Redis, BullMQ |
| **Storage** | AWS S3 (`@aws-sdk/client-s3`) |
| **AI Models & Tools** | OpenAI API (GPT-4.1-mini, Embeddings, TTS), Cohere AI (Rerank v3.5) |
| **Text & Audio Processing** | LangChain Text Splitters, unpdf / pdfjs-dist, FFmpeg (`ffmpeg-static`, `execa`) |
| **Validation & Security** | Zod, JSON Web Tokens (JWT), bcrypt, CORS |

---

## 📂 Project Structure

```text
rag-project/
├── prisma/
│   └── schema.prisma          # Database schema & models (User, Document, Collection, Chat, Podcast, Flashcard)
├── src/
│   ├── app.js                 # Express app initialization & route mounting
│   ├── server.js              # Server entry point
│   ├── config/                # Environment, AWS, Redis, Qdrant, OpenAI, Cohere configurations
│   ├── controllers/           # HTTP request handlers
│   ├── jobs/                  # Job processing definitions
│   ├── lib/                   # Shared singletons (Prisma client)
│   ├── middlewares/           # Auth, error handling, validation, file upload
│   ├── prompt/                # System & RAG prompt templates
│   ├── queues/                # BullMQ queue instances (Document, Flashcard, Podcast)
│   ├── routes/                # Express router definitions
│   ├── schema/                # Zod schemas for structured LLM parsing
│   ├── services/              # Business logic & external API integrations
│   ├── utils/                 # Response formatting, ApiError, JWT helpers
│   ├── validations/           # Zod request validation schemas
│   └── workers/               # BullMQ background worker consumers
├── worker.js                  # Worker process entry point
├── package.json
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key

# PostgreSQL Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rag_project?schema=public"

# Redis (for BullMQ queues)
REDIS_URL="redis://localhost:6379"

# OpenAI API
OPENAI_API_KEY=sk-proj-xxxx...

# Cohere AI
COHERE_API_KEY=your_cohere_api_key

# Qdrant Vector DB
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=documents

# AWS S3 Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Prisma Setup
Ensure PostgreSQL is running, then execute:
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Run the Development Server
Start the Express API server:
```bash
npm run dev
```
The server will run on `http://localhost:3000`.

### 4. Run Background Queue Workers
Start the worker process in a separate terminal window to process background document ingestion, flashcards, and podcasts:
```bash
npm run worker
```

---

## 📌 API Endpoint Reference

### 🔐 Authentication
* `POST /auth/register` — Register a new user
* `POST /auth/login` — Authenticate and receive a JWT token
* `GET /auth/profile` — Fetch current user profile `[Protected]`

### 📂 Collections & Documents
* `POST /collection` — Create a new collection
* `GET /collection` — List user collections
* `GET /collection/:id` — Get collection details
* `POST /documents/upload` — Upload document (Multipart form data)
* `GET /documents` — List user uploaded documents
* `DELETE /documents/:id` — Delete document and associated vectors/storage

### 💬 RAG Chat & Messages
* `POST /chat` — Initialize a new chat session
* `GET /chat` — List user chat sessions
* `POST /chat/:chatId/messages` — Send message and receive RAG-augmented AI stream response

### 🎴 Flashcards
* `POST /flashcards/generate/:documentId` — Trigger background flashcard generation
* `GET /flashcards` — List flashcard sets
* `GET /flashcards/:flashcardSetId` — Fetch a specific flashcard set with questions & answers

### 🎙️ Podcasts
* `POST /podcasts/generate/:documentId` — Trigger background podcast generation
* `GET /podcasts` — List generated podcasts
* `GET /podcasts/:podcastId` — Fetch podcast metadata, audio presigned URL, and script

---

## 📜 Scripts Overview

* `npm run dev` — Starts the API server using `nodemon`
* `npm run worker` — Starts the background BullMQ queue worker
* `npm run prisma:generate` — Generates Prisma Client artifacts
* `npm run prisma:migrate` — Executes database migrations
