# 🛠️ HAVEN OS - ENVIRONMENT VARIABLES & SYSTEM BOOTSTRAP

Welcome to the **HAVEN OS** Environment Setup Manual. This document guides you through configuring and acquiring credentials for every major service integration layer in our zero-cost, high-reliability stack.

---

## 🗺️ Quick Reference Setup Map

| Group | Variable | Service Provider | Free-Tier Cap |
| :--- | :--- | :--- | :--- |
| **Core** | `GEMINI_API_KEY` | Google AI Studio | Generous Free Queries/Min |
| **Database** | `DATABASE_URL` | Turso DB (libSQL) | 500MB storage, 1B reads/mo |
| **Auth** | `LOGTO_ENDPOINT` | Logto Cloud | 10,000 MAUs free (incl. Social) |
| **Real-time** | `ABLY_API_KEY` | Ably Realtime | 6M messages/mo, 200 peak connections |
| **Payments** | `CHARGILY_SECRET_KEY` | Chargily Pay | Free testing dashboard forever |

---

## 🎯 Step-by-Step Configuration Guides

### 1. Turso Database (Primary Persistence)
1. Install the Turso CLI: `curl -sSf.turso.io/install.sh | sh`
2. Authenticate: `turso auth login`
3. Spin up your edge database instance: `turso db create haven-db`
4. Fetch your connection string (`DATABASE_URL`): `turso db show haven-db --url`
5. Mint a secure access token (`DATABASE_AUTH_TOKEN`): `turso db tokens create haven-db`

### 2. Logto Central SSO Authentication
1. Head over to [Logto Cloud](https://cloud.logto.io/) and create a free tenant.
2. Under **Applications**, create a new **Express** application.
3. Note your client credentials:
   - `LOGTO_ENDPOINT`: Found on the application details page.
   - `LOGTO_APP_ID`: Your unique client public identifier.
   - `LOGTO_APP_SECRET`: Private application client secret.
4. Set Redirect URIs inside your Logto console:
   - **Redirect URI**: `https://<YOUR_APP_URL>/api/auth/callback`
   - **Post Sign-out Redirect URI**: `https://<YOUR_APP_URL>/`
5. Generate a safe 32+ character cookie-signing string for `LOGTO_COOKIE_SECRET`.

### 3. Ably Realtime & WebRTC Mesh Signaling
1. Register on [Ably](https://ably.com) for a free developer account.
2. Navigate to your app dashboard, select **API Keys**, and copy your root key.
3. Paste the string into `ABLY_API_KEY`.
4. Turn on **Presence** inside your Ably console on the `chat:*` and `voice:signaling:*` namespaces to enable live user-counter statistics.

### 4. Chargily Pay (Algerian Local Payments)
1. Sign up on [Chargily Pay](https://chargily.com) and toggle **Test Mode** inside the console.
2. Copy your Test Private API Key (`CHARGILY_SECRET_KEY`, starts with `api_sk_test_`).
3. Under developer webhooks, register your webhook callback: `https://<YOUR_APP_URL>/api/payments/webhook`.
4. Copy the generated Webhook Signature token and paste it into `CHARGILY_WEBHOOK_SECRET`.

---

## ⚡ Self-Healing Graceful Failbacks

HAVEN OS is engineered with strict production safety margins. If optional integration keys are missing or unconfigured, the app **will not crash**:
- **Missing Turso DB Keys**: Automatically provisions and queries a secure local file-backed database (`file:local.db`).
- **Missing Logto Credentials**: Seamlessly falls back to an automated sandboxed identity mock session for safe, frictionless local playground testing.
- **Missing Ably Key**: Automatically runs the voice modules in solo-preview mode and initiates simulated local event queues for live chat components.
