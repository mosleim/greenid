import type { APIContext } from 'astro';
import { getDbFromContext, supporters, influencers, politicians, statements, volunteers, organizations } from '../../../db';
import { count } from 'drizzle-orm';

export const prerender = false;

// Check admin session
function isAuthenticated(context: APIContext): boolean {
  const sessionCookie = context.cookies.get('admin_session');
  return !!sessionCookie?.value;
}

// GET - Get dashboard stats
export async function GET(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDbFromContext(context);

    const [
      supportersCount,
      influencersCount,
      politiciansCount,
      statementsCount,
      volunteersCount,
      organizationsCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(supporters),
      db.select({ count: count() }).from(influencers),
      db.select({ count: count() }).from(politicians),
      db.select({ count: count() }).from(statements),
      db.select({ count: count() }).from(volunteers),
      db.select({ count: count() }).from(organizations),
    ]);

    return new Response(JSON.stringify({
      supporters: supportersCount[0].count,
      influencers: influencersCount[0].count,
      politicians: politiciansCount[0].count,
      statements: statementsCount[0].count,
      volunteers: volunteersCount[0].count,
      organizations: organizationsCount[0].count,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
