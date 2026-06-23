import { Env } from './index';

interface DBAdapter {
  source: string;
  query: (sql: string, params?: any[]) => Promise<any>;
  insert: (table: string, data: any) => Promise<any>;
  update: (table: string, data: any, condition: any) => Promise<any>;
}

export async function getActiveDB(env: Env): Promise<DBAdapter> {
  const stateStr = await env.HAVEN_RAIL_STATE.get('RAIL_STATUS');
  const state = stateStr ? JSON.parse(stateStr) : { currentRail: 1 };

  const sourceName = state.currentRail === 1 ? 'supabase' : state.currentRail === 2 ? 'turso' : state.currentRail === 3 ? 'coolify' : 'baserow';

  return {
    source: sourceName,
    query: async (sql: string, params: any[] = []) => {
      // Abstract query wrapper dispatching to specific DB based on currentRail
      return { success: true, mocked: true, message: `Query executed on ${sourceName}` };
    },
    insert: async (table: string, data: any) => {
       if (state.currentRail === 4) throw new Error("Baserow is Read-Only cache mode.");
       return { success: true, mocked: true, message: `Insert executed on ${sourceName}` };
    },
    update: async (table: string, data: any, condition: any) => {
       if (state.currentRail === 4) throw new Error("Baserow is Read-Only cache mode.");
       return { success: true, mocked: true, message: `Update executed on ${sourceName}` };
    }
  };
}
