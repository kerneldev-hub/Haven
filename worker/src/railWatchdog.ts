import { Env } from './index';

interface RailStatus {
  currentRail: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

export async function handleScheduled(env: Env) {
  const stateStr = await env.HAVEN_RAIL_STATE.get('RAIL_STATUS');
  let state: RailStatus = stateStr ? JSON.parse(stateStr) : { currentRail: 1, consecutiveFailures: 0, consecutiveSuccesses: 0 };
  
  // Test Rails from 1 to 4 depending on current state.
  // In a real scenario, we'd ping all higher priority rails to see if they recovered,
  // and ping the current rail to see if it failed.
  
  let pingResult = false;
  try {
    pingResult = await pingRail(state.currentRail, env);
  } catch (err) {
    pingResult = false;
  }

  const oldRail = state.currentRail;

  if (pingResult) {
    state.consecutiveFailures = 0;
    state.consecutiveSuccesses += 1;
    
    // If we aren't on rail 1, check if higher tier is healthy
    if (state.currentRail > 1) {
      const higherRail = state.currentRail - 1;
      const higherPing = await pingRail(higherRail, env).catch(() => false);
      if (higherPing && state.consecutiveSuccesses >= 3) {
        state.currentRail = higherRail;
        state.consecutiveSuccesses = 0; // reset
        await sendAlert(env, `Rail Upgrade: Moving to Rail ${higherRail} (from ${oldRail}) due to recovery.`);
      }
    }
  } else {
    state.consecutiveSuccesses = 0;
    state.consecutiveFailures += 1;
    
    if (state.consecutiveFailures >= 2) {
      if (state.currentRail < 4) {
        state.currentRail += 1;
        state.consecutiveFailures = 0; // reset
        await sendAlert(env, `Rail Degradation! Rail ${oldRail} failed. Falling back to Rail ${state.currentRail}.`);
      } else {
        await sendAlert(env, `CRITICAL: Rail 4 (Baserow Cache) offline! Total failure.`);
      }
    }
  }

  await env.HAVEN_RAIL_STATE.put('RAIL_STATUS', JSON.stringify(state));
  if (env.HEALTHCHECK_IO_URL) {
    fetch(env.HEALTHCHECK_IO_URL).catch(() => {});
  }
}

async function pingRail(rail: number, env: Env): Promise<boolean> {
  // Mock implementations for ping tests
  if (rail === 1) { // Supabase
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/`, { headers: { apikey: env.SUPABASE_SERVICE_KEY }});
    return res.ok;
  }
  if (rail === 2) { // Turso
    // Standard HTTP ping for libSQL
    const res = await fetch(`${env.TURSO_DB_URL}/v2/pipeline`, { 
      method: 'POST',
      headers: { Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}` },
      body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql: "SELECT 1" } }] })
    });
    return res.ok;
  }
  if (rail === 3) { // Coolify PG
    const res = await fetch(`${env.COOLIFY_API_BASE}/health`);
    return res.ok;
  }
  if (rail === 4) { // Baserow
    const res = await fetch(`${env.BASEROW_API_URL}/api/database/tables/${env.BASEROW_TABLE_ID}/`, {
      headers: { Authorization: `Token ${env.BASEROW_TOKEN}` }
    });
    return res.ok;
  }
  return false;
}

async function sendAlert(env: Env, message: string) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `[Haven Failover Orchestrator] - ${new Date().toISOString()}\n${message}`
    })
  }).catch(() => {});
}
