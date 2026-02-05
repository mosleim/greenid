import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Get environment variables from import.meta.env (Astro/Vite)
const databaseUrl = import.meta.env.TURSO_DATABASE_URL || '';
const authToken = import.meta.env.TURSO_AUTH_TOKEN || '';

if (!databaseUrl) {
  console.warn('Warning: TURSO_DATABASE_URL not set. Database queries will fail.');
}

// Create database client
const client = createClient({
  url: databaseUrl,
  authToken: authToken,
});

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Export schema for convenience
export * from './schema';
