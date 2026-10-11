var _a;
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
export const db = (_a = globalThis.__db) !== null && _a !== void 0 ? _a : createDbClient();
if (process.env.NODE_ENV !== 'production') {
    globalThis.__db = db;
}
