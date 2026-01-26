# Railway Deploy (Backend) + How Mobile Communicates

## Why Railway helps testing now
- Your users in Mauritius can use the app from anywhere (no shared Wi‑Fi needed).
- You get a stable HTTPS base URL (avoids Android HTTP/cleartext issues).
- You can set env vars (SMTP/PostHog/JWT/DB) in one place.

## Backend deploy steps (NestJS + Prisma)

### 1) Create Railway project
1. Go to Railway and create a **New Project** → **Deploy from GitHub Repo**
2. Select: `yashhb23/FreshRoots`
3. Set **Root Directory** to: `fresh_roots_backend/nodejs_space`

### 2) Add a PostgreSQL database (recommended)
1. In Railway: **Add** → **Database** → **PostgreSQL**
2. Railway will expose `DATABASE_URL` automatically if you link it, or you can copy/paste.

### 3) Set backend environment variables
In Railway → **Variables** add:

- `DATABASE_URL` (from Railway Postgres)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN` (optional, default ok)
- `JWT_REFRESH_EXPIRES_IN` (optional, default ok)

Email (SMTP):
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `ADMIN_EMAIL`

Analytics (PostHog):
- `POSTHOG_API_KEY`
- `POSTHOG_HOST` (example: `https://us.i.posthog.com` or `https://app.posthog.com`)

### 4) Railway build & start commands
Railway/Nixpacks will run install automatically. Your repo now also runs Prisma generate on install:
- `postinstall`: `prisma generate`

Use:
- **Build command**: `npm run build`
- **Start command**: `npm run start:railway`

`start:railway` runs:
- `prisma db push` (creates tables)
- `node dist/main` (starts Nest)

### 5) Seed initial categories/listings (optional but recommended)
Run once from Railway shell (or locally against the same DB):
- `npx prisma db seed`

This will populate categories and sample listings (including the “Facebook-style” Passion Fruit Plant post).

## How the Mobile App talks to your backend

### Base URL
Mobile uses Axios with `baseURL = config.API_BASE_URL`:
- Dev: `http://<LAN_IP>:3000/api`
- Prod: `https://freshroots.abacusai.app/api` (current)

When you deploy to Railway, you will switch production to:
- `https://<your-railway-domain>/api`

### API calls
Mobile calls the backend via:
- `src/services/api/client.ts` (Axios instance)
- `src/services/api/*.ts` (auth/listings/orders/interest/payments)

### Auth flow
1. Register/Login → backend returns `accessToken` + `refreshToken`
2. Tokens stored in AsyncStorage
3. Axios interceptor attaches `Authorization: Bearer <accessToken>`
4. On 401, refresh is attempted automatically (`/auth/refresh`)

### Firebase + PostHog + Email integration
- Firebase (Auth/Firestore) is used directly by the mobile app for identity + profile sync.
- PostHog is sent from backend (server-side events) when `POSTHOG_API_KEY` is set.
- Emails are sent from backend via SMTP when SMTP vars are set.

