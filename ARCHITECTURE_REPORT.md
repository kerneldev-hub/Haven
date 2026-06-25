# HAVEN — SYSTEM ARCHITECTURE REPORT
**Version:** 3.5.0  
**Status:** Approved for Production  
**Architect:** KERNEL Elite Systems Engine

This document details the modular structure, network boundaries, and state flows of the HAVEN sovereign workspace.

---

## 1. THE 5-LAYER ARCHITECTURAL MODEL

HAVEN is built on a modular, zero-cost-scaling architecture optimized to support 1,000+ concurrent users with edge-native services.

```
+-----------------------------------------------------------------+
| Layer 1: Client / Frontend                                      |
| (React 18 / TypeScript / Vite / TailwindCSS / shadcn / PWA)     |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
| Layer 2: Network / Edge Proxy                                   |
| (Cloudflare Pages / Cloudflare Workers Router)                  |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
| Layer 3: Identity & Shield                                      |
| (Lucia Session Auth / Turnstile Bot Deflector)                  |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
| Layer 4: Data & Real-Time                                       |
| (Turso edge SQLite Database / Drizzle ORM / Ably PubSub Engine) |
+-----------------------------------------------------------------+
                                |
                                v
+-----------------------------------------------------------------+
| Layer 5: Media & Storage                                        |
| (Cloudflare R2 Object Store / WebRTC peer-signaling networks)   |
+-----------------------------------------------------------------+
```

---

## 2. COMPONENT DESIGN SPECIFICATIONS

### 2.1 Layer 1: Frontend Engine (Aesthetic SaaS Blueprint)
- **Framework:** React 18, utilizing functional components and custom hooks.
- **Styling Pipeline:** Tailwind CSS (configured natively via Vite using `@import "tailwindcss";` in `src/index.css`).
- **Icons:** Bundled `lucide-react` SVG library.
- **Micro-Animations:** Framed via `motion` (imported from `motion/react`) for smooth, hardware-accelerated state transitions.

### 2.2 Layer 2: Edge Routing & Compute
- **Hosting Engine:** Cloudflare Pages for ultra-fast, globally replicated static file distribution.
- **Backend API Gateway:** Hono running on Cloudflare Workers. It provides serverless, lightweight endpoint controllers with fast runtime initialization, secure cors headers, and automated error tracking.

### 2.3 Layer 3: Authentication & Identity
- **Session Layer:** Lucia Auth running over edge SQLite database adapters.
- **Access Control:** Secured session cookies, secure flags, and native CSRF validation hooks.
- **Shield:** Cloudflare Turnstile bot deflection integrated directly into registration forms.

### 2.4 Layer 4: Persistent Data & Event Syncing
- **Edge Database:** Turso SQLite. All database operations are mapped through **Drizzle ORM** for type-safe queries and schema definition.
- **Real-Time Layer:** Ably. Serves as the primary Pub/Sub engine to support real-time team chats, notifications, presence syncing, and WebRTC peer signaling.

### 2.5 Layer 5: Media & Storage
- **Object Storage:** Cloudflare R2 (S3-compatible, zero egress fees).
- **Audio/Video Rooms:** WebRTC with decentralized peer-to-peer media paths, coordinated by Ably-based signaling channels.

---

## 3. ZERO-COST SCALING PARADIGM
- All selected tools fall within generous free tiers (e.g., Turso's 500MB free quota, Ably's 6M monthly messages, Cloudflare Workers' 100,000 daily requests limit).
- This guarantees zero-dollar operating overhead while easily carrying 1,000+ active users with millisecond-grade performance.
