import { handleScheduled } from './railWatchdog';
import { getActiveDB } from './dbAdapter';

export interface Env {
  HAVEN_RAIL_STATE: any;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  TURSO_DB_URL: string;
  TURSO_AUTH_TOKEN: string;
  COOLIFY_PG_CONNECTION_STRING: string;
  COOLIFY_API_BASE: string;
  BASEROW_API_URL: string;
  BASEROW_TOKEN: string;
  BASEROW_TABLE_ID: string;
  DISCORD_WEBHOOK_URL?: string;
  HEALTHCHECK_IO_URL?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return new Response('Orchestrator Online', { status: 200 });
    }
    
    // Example usage of active DB adapter
    try {
      const db = await getActiveDB(env);
      return new Response(JSON.stringify({ status: 'ok', source: db.source, timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ status: 'offline', error: error.message }), { status: 500 });
    }
  },

  async scheduled(event: any, env: Env, ctx: any): Promise<void> {
    ctx.waitUntil(handleScheduled(env));
  }
};
