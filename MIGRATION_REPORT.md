# HAVEN — DATABASE & SYSTEM MIGRATION REPORT
**Version:** 3.5.0  
**Source Stack:** Multi-database, Express Legacy  
**Target Stack:** Turso Edge SQLite + Drizzle ORM  
**Migration Lead:** KERNEL Elite Systems Engineer

This document outlines the steps to migrate legacy HAVEN configurations, database models, and environment credentials into the modernized production-ready stack.

---

## 1. DATA SCHEMA MIGRATION STEPS

To transition from legacy or corrupted SQLite states to the clean Drizzle-managed model, execute:

### Step 1: Schema Integrity Check
Validate that the TypeScript models in `src/db/schema.ts` align with your target SQLite tables. Ensure all foreign key connections use appropriate cascade parameters:
```bash
npx drizzle-kit check
```

### Step 2: Database Forced Sync
If the database file (`local.db`) contains malformed indexes or structural corruptions:
1. Back up any valid local tables to a secure offline JSON bucket.
2. Remove the legacy `.db` file:
   ```bash
   rm local.db
   ```
3. Run Drizzle schema push to recreate the entire structure cleanly with normalized table structures:
   ```bash
   npx drizzle-kit push --force
   ```

---

## 2. PRODUCTION TURSO MIGRATION

When deploying HAVEN to production-ready Cloudflare environments, migrate the local SQLite file to a globally replicated **Turso database instance**:

1. **Install Turso CLI:**
   ```bash
   curl -sSf https://get.tur.so/install.sh | sh
   ```
2. **Create Database:**
   ```bash
   turso db create haven-db
   ```
3. **Pipes Schema from Local File:**
   ```bash
   turso db shell haven-db < local.db
   ```
4. **Acquire Connection URL and Credentials:**
   ```bash
   turso db show haven-db --url
   turso db tokens create haven-db
   ```
5. **Configure Cloudflare Pages Environment Variables:**
   Inject `DATABASE_URL` and `DATABASE_AUTH_TOKEN` into your Cloudflare Workers pipeline settings.
