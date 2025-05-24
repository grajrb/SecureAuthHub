# SecureAuthHub Architecture Diagram

![SecureAuthHub Architecture](assets/Screenshot%202025-05-25%20013531.png)

---

- Users interact with the React frontend (document upload, RAG Q&A, authentication)
- Frontend talks to FastAPI backend (REST API)
- Backend uses PostgreSQL (data), Redis (cache/session), S3 (file storage), Elasticsearch (search), unstructured.io (parsing), LangChain/LlamaIndex (NLP)
- Monitoring: Prometheus scrapes FastAPI, Grafana visualizes
- Logging: ELK stack for logs

> See the diagram above for a high-level overview of the system. You can update the image in `assets/` for a new version.
