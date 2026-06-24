import express from 'express';
import cookieParser from 'cookie-parser';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, desc, and, count } from 'drizzle-orm';
import * as schema from './src/db/schema';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  // ─── Environment Validation & Warnings ─────────────────────────────────────────
  console.log('\n================================================================');
  console.log(' 🛡️  HAVEN ENVIRONMENT BOOTSTRAP AUDIT');
  console.log('================================================================');
  
  const criticalEnv = ['DATABASE_URL', 'JWT_SECRET', 'APP_URL'];
  const integrations = {
    'Logto Auth': ['LOGTO_ENDPOINT', 'LOGTO_APP_ID', 'LOGTO_APP_SECRET'],
    'Ably Realtime': ['ABLY_API_KEY'],
    'Chargily Payment': ['CHARGILY_SECRET_KEY', 'CHARGILY_WEBHOOK_SECRET'],
    'BTCPay Server': ['BTCPAY_SERVER_API_KEY', 'BTCPAY_SERVER_STORE_ID', 'BTCPAY_SERVER_URL'],
  };

  criticalEnv.forEach(key => {
    if (!process.env[key]) {
      console.warn(` ⚠️  CRITICAL ENV MISSING: "${key}" - Running with secure local defaults.`);
    } else {
      console.log(` ✓  CRITICAL ENV DETECTED: "${key}"`);
    }
  });

  Object.entries(integrations).forEach(([name, keys]) => {
    const missing = keys.filter(k => !process.env[k]);
    if (missing.length > 0) {
      console.log(` 🔌  ${name}: Running in Mock/Local mode (Missing: ${missing.join(', ')}).`);
    } else {
      console.log(` ✓  ${name}: Fully Configured & Active`);
    }
  });
  console.log('================================================================\n');

  // ─── Database ─────────────────────────────────────────────────────────────────
  const libsqlClient = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(libsqlClient, { schema });

  // Enable SQLite foreign key support
  try {
    await libsqlClient.execute(`PRAGMA foreign_keys = ON;`);
  } catch (err) {
    console.error('Failed to enable foreign keys:', err);
  }

  // ─── App Setup ────────────────────────────────────────────────────────────────
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  // CORS — allow frontend origin
  app.use((req, res, next) => {
    const origin = req.headers.origin || '';
    const allowed = [
      process.env.APP_URL || 'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
    ];
    if (allowed.includes(origin) || !origin) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-CSRF-Token');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function generateId(): string {
    return crypto.randomUUID();
  }

  function hmacSign(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  function verifyChargilyWebhook(payload: string, signature: string): boolean {
    const secret = process.env.CHARGILY_WEBHOOK_SECRET;
    if (!secret) return false;
    const expected = hmacSign(payload, secret);
    try {
      return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
    } catch {
      return false;
    }
  }

  function verifyBtcPayWebhook(payload: string, signature: string): boolean {
    const secret = process.env.BTCPAY_WEBHOOK_SECRET;
    if (!secret) return false;
    const expected = hmacSign(payload, secret);
    try {
      return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
    } catch {
      return false;
    }
  }

  // Session middleware: validate JWT from cookie
  function requireAuth(req: any, res: any, next: any) {
    const token = req.cookies['haven_session'] || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      // Graceful fallback: if in development and Logto isn't fully configured, bypass for local play
      if (process.env.NODE_ENV !== 'production' && (!process.env.LOGTO_ENDPOINT || process.env.LOGTO_ENDPOINT.includes('your-tenant-id'))) {
        req.user = { id: 'dev-user-id', username: 'dev_user', email: 'kernel.env@gmail.com', role: 'admin', tier: 'PRO' };
        return next();
      }
      return res.status(401).json({ error: 'Authentication required' });
    }
    try {
      const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
      req.user = jwt.verify(token, secret) as any;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired session' });
    }
  }

  function requireAdmin(req: any, res: any, next: any) {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  }

  const addAuditLog = async (invoiceId: string, userId: string, event: 'initiated' | 'verified' | 'failed' | 'refunded' | 'admin_override', message: string, metadata?: any) => {
    try {
      await db.insert(schema.auditLogs).values({
        id: generateId(),
        invoiceId,
        userId,
        event,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
    } catch (err) {
      console.error('Audit log failed:', err);
    }
  };

  // ─── Auth Routes ──────────────────────────────────────────────────────────────

  // Logto OIDC callback — handles Google, GitHub, GitLab, Microsoft
  app.get('/api/auth/callback', async (req, res) => {
    const { code, state, error } = req.query;
    if (error) return res.redirect(`/login?error=${error}`);
    if (!code) return res.redirect('/login?error=missing_code');

    try {
      // Exchange code with Logto token endpoint
      const tokenUrl = `${process.env.LOGTO_ENDPOINT}/oidc/token`;
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
        client_id: process.env.LOGTO_APP_ID!,
        client_secret: process.env.LOGTO_APP_SECRET!,
      });

      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error('Logto token exchange failed:', err);
        return res.redirect('/login?error=token_exchange_failed');
      }

      const tokens = await tokenRes.json() as any;
      
      // Get user info from Logto
      const userInfoRes = await fetch(`${process.env.LOGTO_ENDPOINT}/oidc/userinfo`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const logtoUser = await userInfoRes.json() as any;

      // Upsert user in DB
      const existingUsers = await db.select().from(schema.users)
        .where(eq(schema.users.email, logtoUser.email)).limit(1);

      let dbUser = existingUsers[0];
      const now = new Date();

      if (!dbUser) {
        const newId = generateId();
        const username = (logtoUser.preferred_username || logtoUser.email.split('@')[0])
          .toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30);
        await db.insert(schema.users).values({
          id: newId,
          username,
          email: logtoUser.email,
          displayName: logtoUser.name || username,
          avatarUrl: logtoUser.picture,
          role: 'user',
          tier: 'FREE',
          isVerified: logtoUser.email_verified ?? false,
        });
        const created = await db.select().from(schema.users).where(eq(schema.users.id, newId)).limit(1);
        dbUser = created[0];
      } else {
        // Update avatar / display name if changed
        await db.update(schema.users)
          .set({ avatarUrl: logtoUser.picture, displayName: logtoUser.name, updatedAt: now })
          .where(eq(schema.users.id, dbUser.id));
      }

      // Issue JWT session cookie
      const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
      const sessionToken = jwt.sign(
        { id: dbUser.id, username: dbUser.username, email: dbUser.email, role: dbUser.role, tier: dbUser.tier },
        secret,
        { expiresIn: '30d' }
      );

      res.cookie('haven_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      // Check if onboarding needed
      const destination = logtoUser.name ? '/workspace' : '/welcome';
      res.redirect(destination);
    } catch (err: any) {
      console.error('Auth callback error:', err.message);
      res.redirect('/login?error=server_error');
    }
  });

  // Initiate OAuth login
  app.get('/api/auth/login', (req, res) => {
    const provider = (req.query.provider as string) || '';
    const logtoEndpoint = process.env.LOGTO_ENDPOINT;
    const appId = process.env.LOGTO_APP_ID;
    const appUrl = process.env.APP_URL;

    if (!logtoEndpoint || !appId || !appUrl) {
      // In development fallback gracefully to issue local token if not configured
      if (process.env.NODE_ENV !== 'production') {
        const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
        const sessionToken = jwt.sign(
          { id: 'dev-user-id', username: 'dev_user', email: 'kernel.env@gmail.com', role: 'admin', tier: 'PRO' },
          secret,
          { expiresIn: '30d' }
        );
        res.cookie('haven_session', sessionToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/',
        });
        return res.redirect('/workspace');
      }
      return res.status(500).json({ error: 'Auth not configured. Set LOGTO_ENDPOINT, LOGTO_APP_ID, APP_URL in .env' });
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: appId,
      redirect_uri: `${appUrl}/api/auth/callback`,
      scope: 'openid profile email',
      ...(provider && { connector_id: provider }),
    });

    res.redirect(`${logtoEndpoint}/oidc/auth?${params.toString()}`);
  });

  // Session info
  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    try {
      const users = await db.select().from(schema.users).where(eq(schema.users.id, req.user.id)).limit(1);
      if (!users[0]) {
        // Auto create in development if missing
        if (process.env.NODE_ENV !== 'production' && req.user.id === 'dev-user-id') {
          await db.insert(schema.users).values({
            id: 'dev-user-id',
            username: 'dev_user',
            email: 'kernel.env@gmail.com',
            displayName: 'Dev User',
            role: 'admin',
            tier: 'FREE',
          });
          const created = await db.select().from(schema.users).where(eq(schema.users.id, 'dev-user-id')).limit(1);
          return res.json(created[0]);
        }
        return res.status(404).json({ error: 'User not found' });
      }
      const user = users[0];
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        tier: user.tier,
        isVerified: user.isVerified,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('haven_session', { path: '/' });
    const logtoLogout = process.env.LOGTO_ENDPOINT 
      ? `${process.env.LOGTO_ENDPOINT}/oidc/session/end?post_logout_redirect_uri=${process.env.APP_URL}`
      : null;
    res.json({ success: true, logtoLogout });
  });

  // CSRF token
  app.get('/api/auth/csrf-token', (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('haven_csrf', token, { httpOnly: false, sameSite: 'strict', path: '/' });
    res.json({ csrfToken: token });
  });

  // ─── Ably Auth ────────────────────────────────────────────────────────────────
  app.post('/api/ably/auth', requireAuth, async (req: any, res) => {
    const ablyKey = process.env.ABLY_API_KEY;
    if (!ablyKey) {
      // Return mock token for preview
      return res.json({
        keyName: 'mock-key',
        clientId: req.user.id,
        timestamp: Date.now(),
        nonce: 'mock-nonce',
        mac: 'mock-mac',
        capability: '{"*":["*"]}',
      });
    }

    const [keyName, keySecret] = ablyKey.split(':');
    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const ttl = 3600;

    const tokenParams = {
      keyName,
      ttl,
      capability: JSON.stringify({ '*': ['subscribe', 'publish', 'presence'] }),
      clientId: req.user.id,
      timestamp,
      nonce,
    };

    const signString = [
      tokenParams.keyName,
      tokenParams.ttl,
      tokenParams.capability,
      tokenParams.clientId,
      tokenParams.timestamp,
      tokenParams.nonce,
      '',
    ].join('\n');

    const mac = crypto.createHmac('sha256', keySecret).update(signString).digest('base64');
    res.json({ ...tokenParams, mac });
  });

  // ─── User Routes ──────────────────────────────────────────────────────────────
  app.get('/api/users/:username', async (req, res) => {
    try {
      const users = await db.select().from(schema.users)
        .where(eq(schema.users.username, req.params.username)).limit(1);
      if (!users[0]) return res.status(404).json({ error: 'User not found' });
      const u = users[0];
      res.json({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        tier: u.tier,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
      });
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.put('/api/users/me', requireAuth, async (req: any, res) => {
    const { bio, displayName } = req.body;
    try {
      await db.update(schema.users)
        .set({ bio, displayName, updatedAt: new Date() })
        .where(eq(schema.users.id, req.user.id));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // ─── Projects Routes ──────────────────────────────────────────────────────────
  app.get('/api/projects', async (req, res) => {
    try {
      const list = await db.select().from(schema.projects)
        .orderBy(desc(schema.projects.createdAt)).limit(50);
      res.json(list);
    } catch {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', requireAuth, async (req: any, res) => {
    const { name, description, githubRepo } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Project name is required' });
    try {
      const id = generateId();
      await db.insert(schema.projects).values({
        id,
        userId: req.user.id,
        name: name.trim(),
        description: description || '',
        githubRepo: githubRepo || null,
        status: 'active',
      });
      res.json({ id, success: true });
    } catch {
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // ─── Chat Routes ──────────────────────────────────────────────────────────────
  app.get('/api/chat/:roomId/history', requireAuth, async (req: any, res: any) => {
    try {
      const messages = await db.select({
        id: schema.chatMessages.id,
        roomId: schema.chatMessages.roomId,
        content: schema.chatMessages.content,
        messageType: schema.chatMessages.messageType,
        createdAt: schema.chatMessages.createdAt,
        userId: schema.chatMessages.userId,
        username: schema.users.username,
        avatarUrl: schema.users.avatarUrl,
        displayName: schema.users.displayName,
      })
      .from(schema.chatMessages)
      .leftJoin(schema.users, eq(schema.chatMessages.userId, schema.users.id))
      .where(eq(schema.chatMessages.roomId, req.params.roomId))
      .orderBy(desc(schema.chatMessages.createdAt))
      .limit(100);
      res.json(messages.reverse());
    } catch {
      res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  });

  app.post('/api/chat/:roomId/message', requireAuth, async (req: any, res: any) => {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Message cannot be empty' });
    if (content.length > 4000) return res.status(400).json({ error: 'Message too long' });
    try {
      const id = generateId();
      await db.insert(schema.chatMessages).values({
        id,
        roomId: req.params.roomId,
        userId: req.user.id,
        content: content.trim(),
        messageType: 'text',
      });
      res.json({ id, success: true });
    } catch {
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  // ─── Notifications Routes ────────────────────────────────────────────────────
  app.get('/api/notifications', requireAuth, async (req: any, res) => {
    try {
      const list = await db.select().from(schema.notifications)
        .where(eq(schema.notifications.userId, req.user.id))
        .orderBy(desc(schema.notifications.createdAt)).limit(30);
      res.json(list);
    } catch {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.post('/api/notifications/mark-read', requireAuth, async (req: any, res) => {
    try {
      await db.update(schema.notifications)
        .set({ read: true })
        .where(eq(schema.notifications.userId, req.user.id));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // ─── Payments — Chargily (Algeria DZD) & BTCPay ─────────────────────────────
  app.post('/api/payments/checkout', requireAuth, async (req: any, res) => {
    const { planId, paymentMethod, currency, amount } = req.body;
    if (!planId || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing required payment fields' });
    }

    const invoiceId = generateId();

    // Ensure the user exists in the database to prevent foreign key violations on payments insertion
    try {
      const userList = await db.select().from(schema.users).where(eq(schema.users.id, req.user.id)).limit(1);
      if (userList.length === 0) {
        if (process.env.NODE_ENV !== 'production' && req.user.id === 'dev-user-id') {
          await db.insert(schema.users).values({
            id: 'dev-user-id',
            username: 'dev_user',
            email: 'kernel.env@gmail.com',
            displayName: 'Dev User',
            role: 'admin',
            tier: 'FREE',
          });
        } else {
          return res.status(400).json({ error: 'Authenticated user not found in database. Please log in again.' });
        }
      }
    } catch (dbErr: any) {
      console.error('User validation failed in checkout:', dbErr.message);
      return res.status(500).json({ error: 'Database verification failed' });
    }

    try {
      if (paymentMethod === 'chargily') {
        const chargilyKey = process.env.CHARGILY_SECRET_KEY;
        if (!chargilyKey || chargilyKey.includes('your-secret') || chargilyKey.includes('api_sk_live_')) {
          // Mock / Simulated Chargily Response in Dev Mode
          await db.insert(schema.payments).values({
            id: invoiceId,
            userId: req.user.id,
            provider: 'chargily',
            method: 'card',
            amount: Math.round(amount),
            currency: 'DZD',
            transactionId: `MOCK_TXN_${Date.now()}`,
            checkoutId: `MOCK_CK_${Date.now()}`,
            planId,
            status: 'pending',
          });
          return res.json({
            success: true,
            checkoutUrl: `/checkout/success?mockInvoiceId=${invoiceId}&planId=${planId}&amount=${amount}&currency=DZD`,
            invoice: { id: invoiceId, amount: Math.round(amount), currency: 'DZD' },
          });
        }

        const chargilyRes = await fetch('https://pay.chargily.net/api/v2/checkouts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${chargilyKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount),
            currency: 'dzd',
            success_url: `${process.env.APP_URL}/checkout/success`,
            failure_url: `${process.env.APP_URL}/pricing?error=payment_failed`,
            metadata: { invoiceId, planId, userId: req.user.id },
            locale: 'ar',
          }),
        });

        const chargilyData = await chargilyRes.json() as any;
        if (!chargilyData.checkout_url) {
          return res.status(500).json({ error: chargilyData.message || 'Chargily checkout failed' });
        }

        await db.insert(schema.payments).values({
          id: invoiceId,
          userId: req.user.id,
          provider: 'chargily',
          method: 'card',
          amount: Math.round(amount),
          currency: 'DZD',
          transactionId: chargilyData.id,
          checkoutId: chargilyData.id,
          planId,
          status: 'pending',
        });

        return res.json({
          success: true,
          checkoutUrl: chargilyData.checkout_url,
          invoice: { id: invoiceId, amount: Math.round(amount), currency: 'DZD' },
        });
      }

      if (paymentMethod === 'btcpay' || paymentMethod === 'crypto') {
        const btcpayKey = process.env.BTCPAY_SERVER_API_KEY;
        const btcpayStore = process.env.BTCPAY_SERVER_STORE_ID;
        const btcpayUrl = process.env.BTCPAY_SERVER_URL;

        if (!btcpayKey || !btcpayStore || !btcpayUrl || btcpayUrl.includes('your-btcpay-server')) {
          // Fallback / Sandbox BTCPay Server simulation
          await db.insert(schema.payments).values({
            id: invoiceId,
            userId: req.user.id,
            provider: 'btcpay',
            method: 'crypto',
            amount: Math.round(amount * 100),
            currency: 'USDT',
            transactionId: `MOCK_BTCPAY_${Date.now()}`,
            checkoutId: `MOCK_BTCPAY_${Date.now()}`,
            planId,
            status: 'pending',
          });
          return res.json({
            success: true,
            checkoutUrl: `/checkout/success?mockInvoiceId=${invoiceId}&planId=${planId}&amount=${amount}&currency=USDT`,
            invoice: { id: invoiceId, amount, currency: 'USDT' },
          });
        }

        const btcpayRes = await fetch(`${btcpayUrl}/api/v1/stores/${btcpayStore}/invoices`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${btcpayKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: String(amount),
            currency: 'USDT',
            metadata: { invoiceId, planId, userId: req.user.id },
            checkout: {
              redirectURL: `${process.env.APP_URL}/checkout/success`,
              redirectAutomatically: true,
            },
          }),
        });

        const btcpayData = await btcpayRes.json() as any;
        if (!btcpayData.id) {
          return res.status(500).json({ error: btcpayData.message || 'BTCPay invoice creation failed' });
        }

        await db.insert(schema.payments).values({
          id: invoiceId,
          userId: req.user.id,
          provider: 'btcpay',
          method: 'crypto',
          amount: Math.round(amount * 100),
          currency: 'USDT',
          transactionId: btcpayData.id,
          checkoutId: btcpayData.id,
          planId,
          status: 'pending',
        });

        return res.json({
          success: true,
          checkoutUrl: btcpayData.checkoutLink,
          invoice: { id: invoiceId, amount, currency: 'USDT', btcpayId: btcpayData.id },
        });
      }

      res.status(400).json({ error: 'Invalid payment method' });
    } catch (err: any) {
      console.error('Payment checkout error:', err.message);
      res.status(500).json({ error: 'Payment processing failed' });
    }
  });

  // Chargily webhook
  app.post('/api/payments/webhook/chargily', express.raw({ type: 'application/json' }), async (req, res) => {
    const rawBody = req.body.toString();
    const signature = req.headers['signature'] as string;

    if (!verifyChargilyWebhook(rawBody, signature)) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    let event: any;
    try { event = JSON.parse(rawBody); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

    if (event.type === 'checkout.paid') {
      const { metadata, id: checkoutId } = event.data;
      if (!metadata?.invoiceId) return res.json({ received: true });

      await db.update(schema.payments)
        .set({ status: 'confirmed', webhookVerified: true })
        .where(and(eq(schema.payments.checkoutId, checkoutId), eq(schema.payments.provider, 'chargily')));

      const payments = await db.select().from(schema.payments)
        .where(eq(schema.payments.id, metadata.invoiceId)).limit(1);
      
      if (payments[0] && metadata.planId) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        await db.insert(schema.subscriptions).values({
          id: generateId(),
          userId: payments[0].userId,
          paymentId: metadata.invoiceId,
          planId: metadata.planId,
          status: 'active',
          billingCycle: 'monthly',
          endDate,
          amountPaid: payments[0].amount,
          currency: payments[0].currency,
        });
        await db.update(schema.users)
          .set({ tier: metadata.planId, updatedAt: new Date() })
          .where(eq(schema.users.id, payments[0].userId));
      }
    }

    res.json({ received: true });
  });

  // BTCPay webhook
  app.post('/api/payments/webhook/btcpay', express.raw({ type: 'application/json' }), async (req, res) => {
    const rawBody = req.body.toString();
    const signature = req.headers['btcpay-sig'] as string;

    if (!verifyBtcPayWebhook(rawBody, signature?.replace('sha256=', ''))) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    let event: any;
    try { event = JSON.parse(rawBody); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

    if (event.type === 'InvoiceSettled') {
      const payment = await db.select().from(schema.payments)
        .where(eq(schema.payments.checkoutId, event.invoiceId)).limit(1);

      if (payment[0]) {
        await db.update(schema.payments)
          .set({ status: 'confirmed', webhookVerified: true })
          .where(eq(schema.payments.id, payment[0].id));

        if (payment[0].planId) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          await db.insert(schema.subscriptions).values({
            id: generateId(),
            userId: payment[0].userId,
            paymentId: payment[0].id,
            planId: payment[0].planId as any,
            status: 'active',
            billingCycle: 'monthly',
            endDate,
            amountPaid: payment[0].amount,
            currency: payment[0].currency,
          });
          await db.update(schema.users)
            .set({ tier: payment[0].planId as any, updatedAt: new Date() })
            .where(eq(schema.users.id, payment[0].userId));
        }
      }
    }

    res.json({ received: true });
  });

  // User tier check
  app.get('/api/payments/user-tier/:userId', requireAuth, async (req: any, res) => {
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    try {
      const users = await db.select({ tier: schema.users.tier })
        .from(schema.users).where(eq(schema.users.id, req.params.userId)).limit(1);
      res.json({ tier: users[0]?.tier || 'FREE' });
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Downgrade to free
  app.post('/api/payments/downgrade-free', requireAuth, async (req: any, res) => {
    try {
      await db.update(schema.users)
        .set({ tier: 'FREE', updatedAt: new Date() })
        .where(eq(schema.users.id, req.user.id));
      await db.update(schema.subscriptions)
        .set({ status: 'canceled' })
        .where(and(eq(schema.subscriptions.userId, req.user.id), eq(schema.subscriptions.status, 'active')));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Downgrade failed' });
    }
  });

  // ─── Admin Routes ─────────────────────────────────────────────────────────────
  app.get('/api/payments/admin/stats', requireAuth, requireAdmin, async (req, res) => {
    try {
      const [totalUsers] = await db.select({ count: count() }).from(schema.users);
      const [totalPayments] = await db.select({ count: count() }).from(schema.payments)
        .where(eq(schema.payments.status, 'confirmed'));
      const [activeSubscriptions] = await db.select({ count: count() }).from(schema.subscriptions)
        .where(eq(schema.subscriptions.status, 'active'));

      const recentPayments = await db.select().from(schema.payments)
        .orderBy(desc(schema.payments.createdAt)).limit(20);
      const recentSubs = await db.select().from(schema.subscriptions)
        .orderBy(desc(schema.subscriptions.startDate)).limit(20);

      res.json({
        totalUsers: totalUsers.count,
        confirmedPayments: totalPayments.count,
        activeSubscriptions: activeSubscriptions.count,
        payments: recentPayments,
        subscriptions: recentSubs,
      });
    } catch {
      res.status(500).json({ error: 'Failed to load stats' });
    }
  });

  app.post('/api/payments/admin/action', requireAuth, requireAdmin, async (req: any, res) => {
    const { paymentId, action } = req.body;
    if (!paymentId || !['confirm', 'reject', 'refund'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action or missing paymentId' });
    }

    try {
      const payments = await db.select().from(schema.payments)
        .where(eq(schema.payments.id, paymentId)).limit(1);
      if (!payments[0]) return res.status(404).json({ error: 'Payment not found' });
      const payment = payments[0];

      const statusMap: Record<string, any> = {
        confirm: 'confirmed', reject: 'failed', refund: 'refunded'
      };
      await db.update(schema.payments)
        .set({ status: statusMap[action] }).where(eq(schema.payments.id, paymentId));

      if (action === 'confirm' && payment.planId) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        await db.insert(schema.subscriptions).values({
          id: generateId(), userId: payment.userId,
          paymentId: payment.id, planId: payment.planId as any,
          status: 'active', billingCycle: 'monthly', endDate,
          amountPaid: payment.amount, currency: payment.currency,
        });
        await db.update(schema.users)
          .set({ tier: payment.planId as any, updatedAt: new Date() })
          .where(eq(schema.users.id, payment.userId));
      } else if (action === 'refund' || action === 'reject') {
        await db.update(schema.users)
          .set({ tier: 'FREE', updatedAt: new Date() })
          .where(eq(schema.users.id, payment.userId));
      }

      await db.insert(schema.auditLogs).values({
        id: generateId(), invoiceId: paymentId,
        userId: payment.userId, event: 'admin_override',
        message: `Admin ${action} on payment ${paymentId}`,
      });

      res.json({ success: true, payment: { ...payment, status: statusMap[action] } });
    } catch {
      res.status(500).json({ error: 'Admin action failed' });
    }
  });

  // ─── GitHub Releases (Download Page) ─────────────────────────────────────────
  app.get('/api/releases/latest', async (req, res) => {
    const githubToken = process.env.GITHUB_TOKEN;
    const repo = 'dzlab/haven';
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'haven-os/1.0',
    };
    if (githubToken) headers['Authorization'] = `Bearer ${githubToken}`;

    try {
      const releasesRes = await fetch(`https://api.github.com/repos/${repo}/releases`, { headers });
      if (!releasesRes.ok) {
        const errData = await releasesRes.json() as any;
        return res.status(releasesRes.status).json({ 
          error: 'GitHub API error', 
          message: errData.message,
          releases: [] 
        });
      }
      const releases = await releasesRes.json() as any[];
      if (!releases.length) {
        return res.json({ releases: [], hasReleases: false });
      }
      
      const parsed = releases.slice(0, 5).map((r: any) => ({
        id: r.id,
        tag: r.tag_name,
        name: r.name,
        body: r.body,
        draft: r.draft,
        prerelease: r.prerelease,
        publishedAt: r.published_at,
        assets: r.assets.map((a: any) => ({
          id: a.id,
          name: a.name,
          size: a.size,
          downloadUrl: a.browser_download_url,
          contentType: a.content_type,
          downloadCount: a.download_count,
        })),
      }));
      res.json({ releases: parsed, hasReleases: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch releases', releases: [] });
    }
  });

  // ─── Health ───────────────────────────────────────────────────────────────────
  app.get('/api/health', async (req, res) => {
    let dbStatus = 'ok';
    try {
      await db.select({ count: count() }).from(schema.users);
    } catch {
      dbStatus = 'error';
    }
    res.json({ status: 'ok', db: dbStatus, ts: Date.now() });
  });

  // ─── Static Frontend ──────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // ─── Start ────────────────────────────────────────────────────────────────────
  const PORT = parseInt(process.env.PORT || '3000');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Haven OS running on port ${PORT}`);
  });
}

startServer();
