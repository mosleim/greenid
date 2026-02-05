import type { APIContext } from 'astro';
import { getDbFromContext, politicians } from '../../../db';
import { eq } from 'drizzle-orm';

export const prerender = false;

// Check admin session
function isAuthenticated(context: APIContext): boolean {
  const sessionCookie = context.cookies.get('admin_session');
  return !!sessionCookie?.value;
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET - List all politicians
export async function GET(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDbFromContext(context);
    const allPoliticians = await db.select().from(politicians).orderBy(politicians.createdAt);
    return new Response(JSON.stringify(allPoliticians), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching politicians:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch politicians' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create new politician
export async function POST(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDbFromContext(context);
    const data = await context.request.json();
    
    const slug = data.slug || generateSlug(data.name);
    
    const newPolitician = await db.insert(politicians).values({
      slug,
      name: data.name,
      position: data.position,
      party: data.party || null,
      photoUrl: data.photoUrl || null,
      bio: data.bio || null,
      twitterHandle: data.twitterHandle || null,
      instagramHandle: data.instagramHandle || null,
    }).returning();

    return new Response(JSON.stringify(newPolitician[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error creating politician:', error);
    
    if (error.message?.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ error: 'Slug already exists. Please use a different name or custom slug.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Failed to create politician' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update politician
export async function PUT(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDbFromContext(context);
    const data = await context.request.json();
    
    if (!data.id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = await db.update(politicians)
      .set({
        name: data.name,
        position: data.position,
        party: data.party,
        photoUrl: data.photoUrl,
        bio: data.bio,
        twitterHandle: data.twitterHandle,
        instagramHandle: data.instagramHandle,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(politicians.id, data.id))
      .returning();

    if (updated.length === 0) {
      return new Response(JSON.stringify({ error: 'Politician not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(updated[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating politician:', error);
    return new Response(JSON.stringify({ error: 'Failed to update politician' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete politician
export async function DELETE(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = getDbFromContext(context);
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await db.delete(politicians).where(eq(politicians.id, parseInt(id)));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting politician:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete politician' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
