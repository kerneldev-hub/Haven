import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  role: text('role').$type<'user' | 'admin' | 'moderator'>().notNull().default('user'),
  tier: text('tier').$type<'FREE' | 'PRO' | 'TEAM'>().notNull().default('FREE'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  usernameIdx: uniqueIndex('users_username_idx').on(t.username),
  emailIdx: uniqueIndex('users_email_idx').on(t.email),
}));

export const oauthAccounts = sqliteTable('oauth_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').$type<'google' | 'github' | 'gitlab' | 'microsoft'>().notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  accessTokenEncrypted: text('access_token_encrypted'),
  refreshTokenEncrypted: text('refresh_token_encrypted'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  oauthUserIdx: index('oauth_user_id_idx').on(t.userId),
  oauthProviderIdx: uniqueIndex('oauth_provider_account_idx').on(t.provider, t.providerAccountId),
}));

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  slugIdx: uniqueIndex('workspaces_slug_idx').on(t.slug),
}));

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').$type<'active' | 'archived' | 'draft'>().notNull().default('active'),
  githubRepo: text('github_repo'),
  stars: integer('stars').default(0),
  forks: integer('forks').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  projectUserIdx: index('projects_user_id_idx').on(t.userId),
}));

export const files = sqliteTable('files', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  path: text('path').notNull(),
  type: text('type').$type<'file' | 'directory'>().notNull(),
  content: text('content'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').$type<'chargily' | 'btcpay' | 'crypto'>().notNull(),
  method: text('method').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  transactionId: text('transaction_id').notNull(),
  checkoutId: text('checkout_id'),
  planId: text('plan_id').$type<'PRO' | 'TEAM'>(),
  status: text('status').$type<'pending' | 'confirmed' | 'failed' | 'expired' | 'refunded'>().notNull().default('pending'),
  webhookVerified: integer('webhook_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  paymentUserIdx: index('payments_user_id_idx').on(t.userId),
  paymentStatusIdx: index('payments_status_idx').on(t.status),
}));

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  paymentId: text('payment_id').references(() => payments.id),
  planId: text('plan_id').$type<'FREE' | 'PRO' | 'TEAM'>().notNull(),
  status: text('status').$type<'active' | 'expired' | 'canceled'>().notNull().default('active'),
  billingCycle: text('billing_cycle').$type<'monthly' | 'annual'>().notNull().default('monthly'),
  startDate: integer('start_date', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  amountPaid: integer('amount_paid').notNull(),
  currency: text('currency').notNull(),
}, (t) => ({
  subUserIdx: index('subscriptions_user_id_idx').on(t.userId),
  subStatusIdx: index('subscriptions_status_idx').on(t.status),
}));

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  event: text('event').$type<'initiated' | 'verified' | 'failed' | 'refunded' | 'admin_override'>().notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  auditUserIdx: index('audit_logs_user_id_idx').on(t.userId),
  auditTimeIdx: index('audit_logs_timestamp_idx').on(t.timestamp),
}));

export const chatMessages = sqliteTable('chat_messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  messageType: text('message_type').$type<'text' | 'system' | 'file'>().notNull().default('text'),
  edited: integer('edited', { mode: 'boolean' }).default(false),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  chatRoomIdx: index('chat_messages_room_id_idx').on(t.roomId),
  chatUserIdx: index('chat_messages_user_id_idx').on(t.userId),
}));

export const voiceSessions = sqliteTable('voice_sessions', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  leftAt: integer('left_at', { mode: 'timestamp' }),
  hasVideo: integer('has_video', { mode: 'boolean' }).default(false),
  hasMic: integer('has_mic', { mode: 'boolean' }).default(true),
}, (t) => ({
  voiceRoomIdx: index('voice_sessions_room_id_idx').on(t.roomId),
}));

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<'mention' | 'reply' | 'payment' | 'system' | 'upgrade'>().notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  read: integer('read', { mode: 'boolean' }).default(false),
  actionUrl: text('action_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  notifUserIdx: index('notifications_user_id_idx').on(t.userId),
  notifReadIdx: index('notifications_read_idx').on(t.read),
}));
