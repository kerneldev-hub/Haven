import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  avatarUrl: text('avatar_url'),
  tier: text('tier').$type<'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'>().notNull().default('FREE'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  usernameIdx: uniqueIndex('users_username_idx').on(table.username),
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  slugIdx: uniqueIndex('workspaces_slug_idx').on(table.slug),
}));

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  githubRepo: text('github_repo'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const snapshots = sqliteTable('snapshots', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  content: text('content').notNull(),
  description: text('description'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const discussions = sqliteTable('discussions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentId: text('parent_id'), // for threads
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').$type<'chargily' | 'global' | 'crypto'>().notNull(),
  method: text('method').notNull(),
  amount: integer('amount').notNull(), // Multiply by 100 or store direct based on usage
  currency: text('currency').notNull(),
  transactionId: text('transaction_id').notNull(),
  status: text('status').$type<'pending' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'refunded'>().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: text('plan_id').$type<'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'>().notNull(),
  status: text('status').$type<'active' | 'expired' | 'canceled'>().notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  amountPaid: integer('amount_paid').notNull(),
  currency: text('currency').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull(),
  userId: text('user_id').notNull(),
  event: text('event').$type<'initiated' | 'verified' | 'failed' | 'refunded'>().notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});


export const files = sqliteTable('files', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  path: text('path').notNull(),
  type: text('type').notNull(), // 'file' | 'directory'
  content: text('content'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  tier: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
  createdAt: Date;
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  description: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  userId?: string;
  workspaceId: string;
  name: string;
  description?: string;
  githubRepo?: string;
  createdAt: Date;
}

export interface Snapshot {
  id: string;
  projectId: string;
  authorId: string;
  fileName: string;
  content: string;
  description?: string;
  timestamp: Date;
}

export interface Discussion {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  parentId?: string;
  createdAt: Date;
}
