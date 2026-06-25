export interface Env {
  TURSO_DB_URL: string;
  TURSO_AUTH_TOKEN: string;
  LOGTO_ENDPOINT: string;
  LOGTO_APP_ID: string;
  ABLY_API_KEY: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
  CLOUDFLARE_R2_BUCKET: any; // Bindings for R2
  POSTHOG_API_KEY: string;
  SENTRY_DSN: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', database: 'turso', timestamp: Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/config') {
      // Return public config safely
      return new Response(JSON.stringify({
        logtoEndpoint: env.LOGTO_ENDPOINT,
        logtoAppId: env.LOGTO_APP_ID,
        posthogApiKey: env.POSTHOG_API_KEY,
        sentryDsn: env.SENTRY_DSN,
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Direct Turso query proxy or health check
    try {
      const response = await fetch(`${env.TURSO_DB_URL}/v2/pipeline`, { 
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql: "SELECT 1" } }] })
      });
      const dbOnline = response.ok;
      return new Response(JSON.stringify({
        status: dbOnline ? 'online' : 'offline',
        database: 'Turso (libSQL)',
        realtime: env.ABLY_API_KEY ? 'active' : 'inactive',
        voiceVideo: env.LIVEKIT_API_KEY ? 'active' : 'inactive',
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ status: 'error', database: 'Turso (libSQL)', error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
