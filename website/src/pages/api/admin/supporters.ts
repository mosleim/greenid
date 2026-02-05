import type { APIContext } from 'astro';
import { db } from '../../../db';
import { supporters } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

// Check admin session
function isAuthenticated(context: APIContext): boolean {
  const sessionCookie = context.cookies.get('admin_session');
  return !!sessionCookie?.value;
}

// GET - List all supporters
export async function GET(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const allSupporters = await db.select().from(supporters).orderBy(desc(supporters.createdAt));
    return new Response(JSON.stringify(allSupporters), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching supporters:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch supporters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete supporter
export async function DELETE(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await db.delete(supporters).where(eq(supporters.id, parseInt(id)));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting supporter:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete supporter' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
