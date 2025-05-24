# SecureAuthHub Deployment Guide

## Prerequisites
- Docker & Docker Compose
- Node.js & npm (for frontend dev)
- Python 3.11+ (for backend dev)
- Kubernetes cluster (for k8s deployment)

## 1. Local Development

### Backend
```
cd my-fastapi-app
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```
cd SecureAuthHub/client
npm install
npm run dev
```

## 2. Docker Deployment

### Backend
```
docker build -f Dockerfile.backend -t secureauthhub-backend .
docker run -p 8000:8000 --env-file my-fastapi-app/.env secureauthhub-backend
```

### Frontend
```
docker build -f Dockerfile.frontend -t secureauthhub-frontend .
docker run -p 80:80 secureauthhub-frontend
```

## 3. Kubernetes Deployment

1. Build and push Docker images to your registry.
2. Edit `k8s-backend.yaml` and `k8s-frontend.yaml` to use your image names.
3. Deploy:
```
kubectl apply -f k8s-backend.yaml
kubectl apply -f k8s-frontend.yaml
```

## 4. Monitoring & Logging

- **Prometheus:** Use `prometheus.yml` for FastAPI metrics.
- **Grafana:** Use `grafana-datasource.yml` for Prometheus.
- **ELK Stack:**
  - Start with `docker-compose -f docker-compose.elk.yml up`
  - Access Kibana at http://localhost:5601

## 5. Environment Variables
- Store secrets in `.env` or as Kubernetes secrets.
- Never commit secrets to version control.

## 6. API Reference
See [README.md](./README.md) for main endpoints.

---
For more details, see the code comments and architecture diagram.
