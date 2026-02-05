import type { APIContext } from 'astro';
import { db } from '../../../db';
import { organizations } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

// Check admin session
function isAuthenticated(context: APIContext): boolean {
  const sessionCookie = context.cookies.get('admin_session');
  return !!sessionCookie?.value;
}

// GET - List all organizations
export async function GET(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const allOrganizations = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
    return new Response(JSON.stringify(allOrganizations), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch organizations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update organization status
export async function PUT(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await context.request.json();
    
    if (!data.id || !data.status) {
      return new Response(JSON.stringify({ error: 'ID and status are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = await db.update(organizations)
      .set({ status: data.status })
      .where(eq(organizations.id, data.id))
      .returning();

    if (updated.length === 0) {
      return new Response(JSON.stringify({ error: 'Organization not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(updated[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    return new Response(JSON.stringify({ error: 'Failed to update organization' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete organization
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

    await db.delete(organizations).where(eq(organizations.id, parseInt(id)));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete organization' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
