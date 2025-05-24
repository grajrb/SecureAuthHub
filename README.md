# SecureAuthHub - Full Stack Document Management & RAG Platform

## Architecture Overview
🚀 **Normal Flow of SecureAuthHub:**

1️⃣ **User Registers/Login** 🔐  
2️⃣ **User Uploads Document** 📄  
3️⃣ **Backend Processes & Stores Document** 🗄️  
4️⃣ **User Asks a Question (RAG Q&A)** ❓🤖  
5️⃣ **Backend Retrieves & Analyzes Relevant Docs** 📚🔎  
6️⃣ **AI Generates Answer** 💡  
7️⃣ **User Receives Response** 📬


- **Frontend:** React (Vite) app for document upload, RAG Q&A, and authentication (JWT or OIDC)
- **Backend:** FastAPI (Python) with PostgreSQL, Redis, S3, Elasticsearch, unstructured.io, LangChain/LlamaIndex
- **Deployment:** Docker, Kubernetes manifests, Prometheus/Grafana, ELK stack

## Quick Start (Development)

### Backend (FastAPI)
```sh
cd my-fastapi-app
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React)
```sh
cd SecureAuthHub/client
npm install
npm run dev
```

## Docker Deployment

Build and run backend:
```sh
docker build -f Dockerfile.backend -t secureauthhub-backend .
docker run -p 8000:8000 --env-file my-fastapi-app/.env secureauthhub-backend
```

Build and run frontend:
```sh
docker build -f Dockerfile.frontend -t secureauthhub-frontend .
docker run -p 80:80 secureauthhub-frontend
```

## Kubernetes Deployment

1. Build and push Docker images to your registry.
2. Update `image:` fields in `k8s-backend.yaml` and `k8s-frontend.yaml`.
3. Deploy:
```sh
kubectl apply -f k8s-backend.yaml
kubectl apply -f k8s-frontend.yaml
```

## Monitoring & Logging

- **Prometheus:** Use `prometheus.yml` for scraping FastAPI metrics.
- **Grafana:** Use `grafana-datasource.yml` for Prometheus integration.
- **ELK Stack:** Use `docker-compose.elk.yml` to run Elasticsearch, Logstash, and Kibana for logs.

## API Endpoints
- `/api/register` - Register user (JWT)
- `/api/token` - Login (JWT)
- `/api/documents/upload` - Upload document
- `/api/chat/query` - RAG Q&A

## Security
- Store secrets in `.env` files or Kubernetes secrets.
- Use HTTPS in production.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

