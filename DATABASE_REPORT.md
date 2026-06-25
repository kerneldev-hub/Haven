# HAVEN — DATABASE ENGINEERING REPORT
**Version:** 3.5.0  
**Dialect:** SQLite (Turso Edge Replicas)  
**ORM:** Drizzle ORM  
**DBA:** KERNEL Elite Systems Engine

This document defines the persistent schema layout, relational constraints, indices, and operational states of the HAVEN database.

---

## 1. SCHEMA STRUCTURE & TABLES

The database schema is written in TypeScript using Drizzle ORM schemas in `/src/db/schema.ts` and pushed to a local or edge SQLite database.

```
+-------------------------------------------------------+
|                       users                           |
|  - id (PK, text)                                      |
|  - username (text, unique)                            |
|  - email (text, unique)                               |
|  - role (text)                                        |
|  - tier (text)                                        |
+-------------------------------------------------------+
       |                                   |
       v                                   v
+------------------+               +--------------------+
|     profiles     |               |      settings      |
|  - id (PK, text) |               |  - id (PK, text)   |
|  - userId (FK)   |               |  - userId (FK)     |
+------------------+               +--------------------+
       |
       +---------------------------------------------+
       |                     |                       |
       v                     v                       v
+--------------+     +---------------+     +--------------------+
| friendships  |     | conversations |     |    subscriptions   |
| - user1Id    |     | - id (PK)     |     | - id (PK)          |
| - user2Id    |     +---------------+     | - userId (FK)      |
+--------------+             |             +--------------------+
                             v                       |
                     +---------------+               v
                     |   messages    |     +--------------------+
                     | - id (PK)     |     |      payments      |
                     | - convId (FK) |     | - id (PK)          |
                     +---------------+     | - userId (FK)      |
                                           +--------------------+
```

---

## 2. TABLE SCHEMAS IN DETAILS

### 2.1 Table: `users`
Tracks the primary identity, credentials, roles, and premium tiers of accounts.
- `id` (text, primary key)
- `username` (text, unique, nullable: false)
- `email` (text, unique, nullable: false)
- `display_name` (text)
- `avatar_url` (text)
- `bio` (text)
- `role` (text, default: 'user')
- `tier` (text, default: 'FREE')
- `is_verified` (integer, boolean flag, default: 0)
- `created_at` (integer, timestamp)
- `updated_at` (integer, timestamp)

### 2.2 Table: `profiles`
Holds metadata, active status, system statistics, and workspace activity details.
- `id` (text, primary key)
- `user_id` (text, foreign key referencing `users.id` with CASCADE deletion)
- `full_name` (text)
- `company` (text)
- `github_username` (text)
- `twitter_username` (text)
- `website_url` (text)
- `timezone` (text, default: 'UTC')
- `reputation` (integer, default: 100)

### 2.3 Table: `friendships`
Connects user nodes into direct direct peer networks with status tracking.
- `id` (text, primary key)
- `sender_id` (text, foreign key referencing `users.id`)
- `receiver_id` (text, foreign key referencing `users.id`)
- `status` (text, default: 'pending' — ['pending', 'accepted', 'blocked'])
- `created_at` (integer, timestamp)

### 2.4 Table: `conversations`
Unifies multiple users into direct message loops or channels.
- `id` (text, primary key)
- `name` (text, nullable: true)
- `type` (text, default: 'direct' — ['direct', 'group'])
- `created_at` (integer, timestamp)

### 2.5 Table: `messages`
Stores conversation messages with complete reading receipt audit logs.
- `id` (text, primary key)
- `conversation_id` (text, foreign key referencing `conversations.id`)
- `sender_id` (text, foreign key referencing `users.id`)
- `content` (text, nullable: false)
- `is_read` (integer, default: 0)
- `created_at` (integer, timestamp)

### 2.6 Table: `notifications`
Dispatches system triggers and social notifications to active clients.
- `id` (text, primary key)
- `user_id` (text, foreign key referencing `users.id`)
- `type` (text, nullable: false)
- `title` (text, nullable: false)
- `body` (text, nullable: false)
- `is_read` (integer, default: 0)
- `created_at` (integer, timestamp)

### 2.7 Table: `subscriptions`
Tracks active product purchases, plan metrics, and billing cycles.
- `id` (text, primary key)
- `user_id` (text, foreign key referencing `users.id`)
- `status` (text, nullable: false)
- `plan_id` (text, default: 'FREE' — ['FREE', 'PRO', 'LIFETIME'])
- `current_period_start` (integer)
- `current_period_end` (integer)
- `created_at` (integer)

### 2.8 Table: `payments`
Maintains records of fiat or cryptocurrency invoices processed.
- `id` (text, primary key)
- `user_id` (text, foreign key referencing `users.id`)
- `amount` (real, numeric price)
- `currency` (text, default: 'USD')
- `gateway` (text)
- `status` (text, default: 'pending')
- `transaction_hash` (text, unique)
- `created_at` (integer)

### 2.9 Table: `audit_logs`
Saves full forensic actions and security events.
- `id` (text, primary key)
- `user_id` (text, foreign key referencing `users.id`)
- `action` (text, nullable: false)
- `ip_address` (text)
- `user_agent` (text)
- `created_at` (integer)

### 2.10 Table: `settings`
Keeps dynamic preferences, custom appearance configurations, and privacy defaults.
- `id` (text, primary key)
- `user_id` (text, foreign key referencing `users.id`)
- `theme` (text, default: 'dark')
- `notifications_enabled` (integer, default: 1)
- `profile_visibility` (text, default: 'public')
- `created_at` (integer)

---

## 3. RELATIONAL INDEXES FOR ULTRA-FAST LOOKUPS

To guarantee sub-millisecond query performance at 1,000+ user scales, indices are created for key query entry points:

- **Index on users (email, username):** Direct credential lookups.
- **Index on conversations & messages:** Stated over `conversation_id` and sorted by `created_at` for rapid chat loading.
- **Index on friendships:** Unique combinations of `sender_id` + `receiver_id` to prevent duplicate peer entries.
- **Index on audit logs:** Fast diagnostic lookup grouped on `user_id` / `action`.
- **Index on payments:** Filtered on `transaction_hash` for verification.
