# CryvixAI

AI SaaS web application — monorepo with React frontend, Express backend, and Supabase.

## Project structure

```
CryvixAI/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Node.js + Express API
├── supabase/          # Database migrations, seeds, Edge Functions
├── .env.example       # Root env template (optional shared vars)
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local DB & migrations)
- A [Supabase](https://supabase.com/) project (cloud or local)

## Quick start

### 1. Clone and install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Environment variables

Copy each `.env.example` to `.env` and fill in values:

| Location | File |
|----------|------|
| Root (optional) | `.env` |
| Frontend | `frontend/.env` |
| Backend | `backend/.env` |

### 3. Supabase

```bash
# From project root — link to your Supabase project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations (when added)
supabase db push
```

### 4. Run locally

```bash
# Terminal 1 — Backend (default port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (default port 5173)
cd frontend
npm run dev
```

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database & Auth | Supabase (PostgreSQL, Auth, Storage) |
| AI | (To be configured — OpenAI, Anthropic, etc.) |

## Next steps

- [ ] Implement auth flow (Supabase Auth + protected routes)
- [ ] Add API routes and AI service integration
- [ ] Create database schema in `supabase/migrations/`
- [ ] Build UI pages and components

## License

Private — CryvixAI
