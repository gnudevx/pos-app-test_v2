# 🚀 How to Run POS App

## Prerequisites
✅ All dependencies are installed

## Running the Application

### Option 1: Run All Services in One Terminal (Easiest)

#### 1. Start Backend Services (in separate terminal tabs/windows)

**Terminal 1 - Auth Backend (Port 8001)**
```bash
cd src/services/auth_backend
python -m uvicorn app.main:app --port 8001 --reload
```

**Terminal 2 - Product Catalog Backend (Port 8002)**
```bash
cd src/services/product_catalog_backend
python -m uvicorn app.main:app --port 8002 --reload
```

**Terminal 3 - Shopping Cart Backend (Port 8003)**
```bash
cd src/services/shopping_cart_backend
python -m uvicorn app.main:app --port 8003 --reload
```

**Terminal 4 - Inventory Backend (Port 8004)**
```bash
cd src/services/inventory_backend
python -m uvicorn app.main:app --port 8004 --reload
```

**Terminal 5 - Order History Backend (Port 8005)**
```bash
cd src/services/order_history_backend
python -m uvicorn app.main:app --port 8005 --reload
```

**Terminal 6 - Checkout Backend (Port 8006)**
```bash
cd src/services/checkout_backend
python -m uvicorn app.main:app --port 8006 --reload
```

#### 2. Start Frontend Development Server

**Terminal 7 - Frontend (Port 5173)**
```bash
cd src/frontend
npm run dev
```

### Option 2: Start Individual Services

After starting backend services above, open your browser to: **http://localhost:5173**

## Backend Service URLs

| Service | Port | URL |
|---------|------|-----|
| Auth | 8001 | http://localhost:8001 |
| Products | 8002 | http://localhost:8002 |
| Shopping Cart | 8003 | http://localhost:8003 |
| Inventory | 8004 | http://localhost:8004 |
| Orders | 8005 | http://localhost:8005 |
| Checkout | 8006 | http://localhost:8006 |

## Frontend

- **Dev Server**: http://localhost:5173
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Troubleshooting

### Port Already in Use
If a port is already in use, change it:
```bash
python -m uvicorn app.main:app --port 9001 --reload
```

### Module Not Found Error
Ensure virtual environment is activated and all dependencies are installed:
```bash
pip install -r requirements.txt
```

### Frontend Build Issues
Clear cache and reinstall:
```bash
cd src/frontend
rm -r node_modules package-lock.json
npm install
```

## Project Structure

```
├── src/
│   ├── frontend/          # React + Vite + TypeScript
│   └── services/          # Microservices (Python + FastAPI)
│       ├── auth_backend/
│       ├── product_catalog_backend/
│       ├── shopping_cart_backend/
│       ├── inventory_backend/
│       ├── order_history_backend/
│       └── checkout_backend/
```

