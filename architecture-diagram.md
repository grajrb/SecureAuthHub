# SecureAuthHub Architecture Diagram

![SecureAuthHub Architecture](assets/Screenshot%202025-05-25%20013531.png)

---

- Users interact with the React frontend (document upload, RAG Q&A, authentication)
- Frontend talks to FastAPI backend (REST API)
- Backend uses PostgreSQL (data), Redis (cache/session), S3 (file storage), Elasticsearch (search), unstructured.io (parsing), LangChain/LlamaIndex (NLP)
- Monitoring: Prometheus scrapes FastAPI, Grafana visualizes
- Logging: ELK stack for logs

> See the diagram above for a high-level overview of the system. You can update the image in `assets/` for a new version.

---

## Source Code Documentation

### Overview
SecureAuthHub is a full-stack RAG (Retrieval-Augmented Generation) document management platform. It is designed for secure document upload, parsing, search, and agent-based Q&A, with robust authentication and production-grade deployment.

### Key Components

- **Frontend (React/Vite)**
  - Provides user interface for authentication, document upload, and RAG Q&A.
  - Communicates with backend via REST API.
  - Key files: `frontend/client/src/pages/`, `frontend/client/src/components/`, `frontend/client/src/lib/`

- **Backend (FastAPI/Python)**
  - Handles authentication (JWT), document upload, parsing (unstructured.io), storage (S3), search (Elasticsearch), and RAG Q&A (LlamaIndex, LangChain, Autogen).
  - Key files: `backend/app/api/routes.py`, `backend/app/models/models.py`, `backend/app/schemas/schemas.py`, `backend/app/rag_utils.py`, `backend/app/s3_utils.py`, `backend/app/es_utils.py`, `backend/app/unstructured_utils.py`

- **Database (PostgreSQL)**
  - Stores user, document, and chat metadata.
  - Accessed via Drizzle ORM (Node legacy) and SQLAlchemy (Python).

- **Cache (Redis)**
  - Used for session and cache management (optional, for scaling).

- **Object Storage (S3)**
  - Stores uploaded documents securely.

- **Search (Elasticsearch)**
  - Indexes and retrieves document chunks for RAG.

- **Parsing (unstructured.io)**
  - Extracts text and structure from uploaded documents.

- **RAG & Agents (LlamaIndex, LangChain, Autogen)**
  - Retrieves relevant context and generates answers to user queries.

- **Monitoring & Logging**
  - Prometheus & Grafana for metrics.
  - ELK stack for logs.

### Flow
1. User registers/logins (JWT auth)
2. User uploads document (frontend → backend)
3. Backend parses, stores, and indexes document (S3, Elasticsearch)
4. User asks a question (frontend → backend)
5. Backend retrieves relevant docs (Elasticsearch, LlamaIndex)
6. Agent generates answer (LangChain/Autogen)
7. User receives response

### Deployment
- Docker and Kubernetes manifests for production deployment.
- Environment variables managed via `.env` files (see `.env.example`).

### Diagrams & HLD/LLD
- [Architecture Diagram](./architecture-diagram.md)
- [Google Doc: HLD/LLD](https://docs.google.com/document/d/your-hld-lld-link)

> For more details, see code comments and the architecture diagram. Update the Google Doc link above with your actual design document if available.
