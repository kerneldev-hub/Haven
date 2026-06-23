# HAVEN OS - System Architecture & Deployment

Welcome to **HAVEN OS**, the premium AI workspace ecosystem. This repository contains the complete execution framework bridging standard web deployments, edge databases, native desktop apps (Tauri), and mobile environments (Capacitor).

## Core Architecture

- **Frontend**: Vite + React 18 + TailwindCSS, fully responsive and desktop/mobile aware.
- **Backend Edge**: Node/Express serving API routes with JWT + HTTP-Only authentication handling, seamlessly compiled to `dist/server.cjs`.
- **Primary Database**: Turso (libSQL) handling relational state via edge replication.
- **Failover / Sync Protocol**: 4-tiered fallback (Supabase -> Turso -> Coolify Postgres -> Baserow API cache).

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The system requires specific environment variables for Turso, Supabase, and internal API keys (see `.env.example`).

## Building & Deploying the Web Version

```bash
# Build frontend and server bundles
npm run build

# Start the generated production server
npm run start
```

## Desktop Build (Windows / Linux)

HAVEN employs **Tauri**. Windows and Linux are supported natively; macOS is explicitly NOT supported.

```bash
# Developer Sandbox
npm run tauri:dev

# Compile Native Binaries
npm run tauri:build
```

## Native Mobile Build (Android)

Built via Android Capacitor layer. iOS is explicitly NOT supported.

```bash
# Sync frontend assets to Android package
npx cap sync android

# Build sideloadable APK
cd android && ./gradlew assembleDebug
```

## Contribution & Security

All interactions with external APIs must be proxied through the server-side API endpoints (`/api/*`). The application explicitly forbids client-side leaking of DB or Webhook keys. Any PRs bypassing HMAC signature validations will be rejected.
