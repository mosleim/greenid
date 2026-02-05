import type { APIContext } from 'astro';
import { db } from '../../../db';
import { statements, politicians } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

// Check admin session
function isAuthenticated(context: APIContext): boolean {
  const sessionCookie = context.cookies.get('admin_session');
  return !!sessionCookie?.value;
}

// GET - List all statements with politician info
export async function GET(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const allStatements = await db
      .select({
        id: statements.id,
        politicianId: statements.politicianId,
        politicianName: politicians.name,
        content: statements.content,
        source: statements.source,
        sourceUrl: statements.sourceUrl,
        sentiment: statements.sentiment,
        context: statements.context,
        statementDate: statements.statementDate,
        isVerified: statements.isVerified,
        createdAt: statements.createdAt,
      })
      .from(statements)
      .leftJoin(politicians, eq(statements.politicianId, politicians.id))
      .orderBy(statements.statementDate);
      
    return new Response(JSON.stringify(allStatements), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching statements:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch statements' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST - Create new statement
export async function POST(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await context.request.json();
    
    // Validate required fields
    if (!data.politicianId || !data.content || !data.source || !data.sourceUrl || !data.statementDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const newStatement = await db.insert(statements).values({
      politicianId: data.politicianId,
      content: data.content,
      source: data.source,
      sourceUrl: data.sourceUrl,
      sentiment: data.sentiment || 'netral',
      context: data.context || null,
      statementDate: data.statementDate,
      isVerified: data.isVerified || false,
    }).returning();

    return new Response(JSON.stringify(newStatement[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating statement:', error);
    return new Response(JSON.stringify({ error: 'Failed to create statement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT - Update statement
export async function PUT(context: APIContext) {
  if (!isAuthenticated(context)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await context.request.json();
    
    if (!data.id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = await db.update(statements)
      .set({
        politicianId: data.politicianId,
        content: data.content,
        source: data.source,
        sourceUrl: data.sourceUrl,
        sentiment: data.sentiment,
        context: data.context,
        statementDate: data.statementDate,
        isVerified: data.isVerified,
      })
      .where(eq(statements.id, data.id))
      .returning();

    if (updated.length === 0) {
      return new Response(JSON.stringify({ error: 'Statement not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(updated[0]), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating statement:', error);
    return new Response(JSON.stringify({ error: 'Failed to update statement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE - Delete statement
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

    await db.delete(statements).where(eq(statements.id, parseInt(id)));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting statement:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete statement' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
