import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Function to create database connection with provided env vars
export function createDbConnection(env: { TURSO_DATABASE_URL?: string; TURSO_AUTH_TOKEN?: string }) {
  const databaseUrl = env.TURSO_DATABASE_URL || '';
  const authToken = env.TURSO_AUTH_TOKEN || '';

  if (!databaseUrl) {
    throw new Error('TURSO_DATABASE_URL not set');
  }

  const client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });

  return drizzle(client, { schema });
}

// Helper to get db from Cloudflare runtime context or fallback to import.meta.env
export function getDbFromContext(context: { locals: { runtime?: { env?: any } } }) {
  const runtime = context.locals.runtime as any;
  const env = runtime?.env || {};
  
  return createDbConnection({
    TURSO_DATABASE_URL: env.TURSO_DATABASE_URL || import.meta.env?.TURSO_DATABASE_URL,
    TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN || import.meta.env?.TURSO_AUTH_TOKEN,
  });
}

// Default db instance for build/prerender context (uses import.meta.env)
const databaseUrl = import.meta.env?.TURSO_DATABASE_URL || '';
const authToken = import.meta.env?.TURSO_AUTH_TOKEN || '';

let db: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  const client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });
  db = drizzle(client, { schema });
}

export { db };

// Export schema for convenience
export * from './schema';
