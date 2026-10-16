# Digital HR Frontend

Frontend for the JanaPost Digital HR platform.

## Run locally

### 1) Install dependencies

```bash
npm install
```

### 2) Start frontend in development mode

```bash
npm run dev
```

Open:
- http://localhost:5173

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Run with backend and database via Docker

From the backend folder:

```bash
cd ../digital-hr
docker compose up --build -d
```

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui

## Default login

```text
email: admin@janapost.kz
password: admin123
```

## Project structure

- `src/features` — domain modules (employees, departments, vacancies, candidates, onboarding, analytics)
- `src/app` — routing and layout
- `src/shared` — API client and shared types
- `src/theme.ts` — MUI theme configuration

## Environment

Frontend uses the backend API URL from:

```text
VITE_API_URL
```

If you run the app via Docker Compose, it is configured automatically to:

```text
http://localhost:8080/api/v1
```
