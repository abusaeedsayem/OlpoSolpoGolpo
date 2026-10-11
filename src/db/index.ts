import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function createDbClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }

  const client = createClient({ url, authToken });
  return drizzle(client, { schema });
}

// Singleton for edge runtime compatibility
declare global {
  var __db: ReturnType<typeof createDbClient> | undefined;
}

export const db = globalThis.__db ?? createDbClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__db = db;
}
