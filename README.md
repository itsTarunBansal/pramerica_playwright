# AI Insurance Test Copilot - Starter Scaffold

This repo contains a ready-to-run starter scaffold for:
- Express.js backend
- React (Vite + TypeScript) frontend
- MongoDB via Docker Compose

## Prerequisites
- Docker Desktop
- Docker Compose

## Run
```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MongoDB: localhost:27017

## Project Layout
```text
backend/   Express + Mongoose
frontend/  React + Vite + TypeScript
```

## Notes
- Backend connects to MongoDB on startup and seeds a demo tenant.
