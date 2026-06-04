# 🐳 POS App - Docker Setup & Run Guide

## Files Created

- `Dockerfile.frontend` - Frontend image
- `Dockerfile.backend` - Backend services image (shared)
- `docker-compose.yml` - Orchestrates all services

---

## Prerequisites

✅ Install Docker & Docker Compose:
- **Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Mac**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: [Docker + Docker Compose](https://docs.docker.com/compose/install/)

---

## How to Run

### Option 1: Run Everything with One Command ⭐ (Recommended)

```bash
docker-compose up --build
```

**This will:**
- Build all images
- Start all 6 backend services + frontend
- Create a shared network for communication
- Expose ports 5173 (frontend) + 8001-8006 (backends)

### Option 2: Run in Background (Detached Mode)

```bash
docker-compose up -d --build
```

**Check status:**
```bash
docker-compose ps
```

### Option 3: Build First, Then Run

```bash
# Build all images
docker-compose build

# Start services
docker-compose up
```

---

## Access the Application

After running, open your browser:

🌐 **Frontend**: http://localhost:5173

### Backend Services (for testing/debugging):

| Service | URL | Port |
|---------|-----|------|
| Auth | http://localhost:8001 | 8001 |
| Products | http://localhost:8002 | 8002 |
| Cart | http://localhost:8003 | 8003 |
| Inventory | http://localhost:8004 | 8004 |
| Orders | http://localhost:8005 | 8005 |
| Checkout | http://localhost:8006 | 8006 |

---

## Useful Docker Compose Commands

### Stop All Services
```bash
docker-compose down
```

### Stop Specific Service
```bash
docker-compose stop auth
docker-compose stop products
```

### Restart a Service
```bash
docker-compose restart auth
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs auth

# Follow logs (live)
docker-compose logs -f frontend
```

### Remove Containers & Networks
```bash
docker-compose down -v  # -v removes volumes too
```

### Rebuild and Restart
```bash
docker-compose up -d --build
```

---

## Docker Image Info

### Frontend Image
- **Base**: Node 18 Alpine (multi-stage build)
- **Port**: 5173
- **Built with**: Vite + React
- **Served with**: Node serve

### Backend Image
- **Base**: Python 3.11 Slim
- **Ports**: 8001-8006 (one per service)
- **Framework**: FastAPI + Uvicorn
- **Shared**: Single Dockerfile for all backends

---

## Troubleshooting

### Ports Already in Use

Edit `docker-compose.yml` and change port mappings:

```yaml
# Change from:
ports:
  - "5173:5173"

# To:
ports:
  - "3000:5173"
```

### Build Fails

Clear cache and rebuild:
```bash
docker-compose build --no-cache
```

### Services Won't Start

Check logs:
```bash
docker-compose logs
```

### Permission Denied (Linux)

Add your user to docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Docker Network

All services communicate via network `pos_network`:

- **Frontend** → Backend services via service names (e.g., `http://auth:8000`)
- **Backend services** → Each other via service names
- **External access** → Via localhost + exposed ports

---

## Production Tips

### For Production Deployment

1. **Remove --reload flag** from uvicorn in services
2. **Use environment variables** for secrets
3. **Add health checks** to docker-compose.yml
4. **Use docker secrets** for sensitive data
5. **Set resource limits** for containers

Example production docker-compose:
```yaml
services:
  frontend:
    # ... config ...
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5173"]
      interval: 30s
      timeout: 10s
      retries: 3
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
```

---

## Development vs Production

### Development (Current Setup)
- ✅ Hot reload enabled
- ✅ Debug logging
- ✅ Exposed all ports
- ✅ Build on startup

### Production
- ⚡ No hot reload
- 🔒 Minimal logging
- 🔐 Reverse proxy (nginx)
- 📦 Pre-built images

---

## Quick Reference

```bash
# Start everything
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Clean up (removes containers, networks, volumes)
docker-compose down -v
```

---

## Project Structure with Docker

```
pos-app-test_v2/
├── docker-compose.yml          # Orchestration file
├── Dockerfile.frontend         # Frontend image
├── Dockerfile.backend          # Backend services image
├── src/
│   ├── frontend/               # React app
│   └── services/
│       ├── auth_backend/
│       ├── product_catalog_backend/
│       ├── shopping_cart_backend/
│       ├── inventory_backend/
│       ├── order_history_backend/
│       └── checkout_backend/
```

