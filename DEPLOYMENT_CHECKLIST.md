# HAVEN — PRODUCTION DEPLOYMENT CHECKLIST
**Version:** 3.5.0  
**Target:** Cloudflare Pages + Turso + Ably  
**Prepared by:** KERNEL Elite Systems Engineer

Ensure each step is checked off before promoting any release to production.

---

## 1. PRE-FLIGHT COMPILES & TYPE SANITY

- [ ] **TypeScript Typecheck:** No compilation errors or warnings inside frontend code.
  ```bash
  npm run typecheck
  ```
- [ ] **Linter Check:** Project is fully compliant with standard styling conventions.
  ```bash
  npm run lint
  ```
- [ ] **Production Build Check:** Vite successfully builds static files inside the `dist/` directory.
  ```bash
  npm run build
  ```

---

## 2. PRODUCTION INFRASTRUCTURE PREPARATION

### 2.1 Turso Database setup
- [ ] Spin up a production-ready Turso database instance.
- [ ] Export the secure schema definition from the development repository.
- [ ] Push schema constraints using Drizzle ORM:
  ```bash
  DATABASE_URL=libsql://your-prod-db-tenant.turso.io DATABASE_AUTH_TOKEN=your-prod-token npx drizzle-kit push
  ```

### 2.2 Ably Real-Time setup
- [ ] Create an application inside the Ably dashboard.
- [ ] Retrieve production API Keys (`ABLY_API_KEY`).
- [ ] Configure event rules and channel namespaces.

### 2.3 Cloudflare R2 Bucket Setup
- [ ] Create a storage bucket on Cloudflare R2 for user file uploads.
- [ ] Set up CORS policies allowing origins matching your target custom domain.

---

## 3. SECURED ENVIRONMENT VARIABLES DECLARATION

Configure the following environment values securely inside the Cloudflare Pages / Workers console dashboard (never commit these values to source control):

| Variable Key | Purpose | Required Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | Turso DB connection string | `libsql://your-db-tenant.turso.io` |
| `DATABASE_AUTH_TOKEN` | Production Turso Access Token | Cryptographic base64 token |
| `JWT_SECRET` | Auth Token Encryption Key | Secure, random 64-character string |
| `ABLY_API_KEY` | Real-time Pub/Sub authorization | String key formatted as `id:secret` |
| `SENTRY_DSN` | Global error monitoring stream | Valid Sentry https URL endpoint |
| `TURNSTILE_SITE_KEY` | Bot deflection verification widget | Cloudflare Turnstile Site Key |
| `TURNSTILE_SECRET_KEY` | Server-side captcha validator | Cloudflare Turnstile Secret Key |

---

## 4. RELEASE & VERIFICATION

- [ ] Clear browser cache on testing environments, verify login and registration works.
- [ ] Navigate through pages to confirm all routes load instantly.
- [ ] Initiate a trial cryptocurrency payment to verify multiplier conversion and layout rendering.
- [ ] Activate PWA installation on a mobile client, test standalone sandbox launches and offline support.
