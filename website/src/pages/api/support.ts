import type { APIRoute } from 'astro';
import { createDbConnection, supporters } from '../../db';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get env from Cloudflare runtime context
    const runtime = locals.runtime as any;
    const env = runtime?.env || {};
    
    // Create db connection with runtime env
    const db = createDbConnection({
      TURSO_DATABASE_URL: env.TURSO_DATABASE_URL || import.meta.env?.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN || import.meta.env?.TURSO_AUTH_TOKEN,
    });
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Name and email are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert supporter
    const result = await db.insert(supporters).values({
      name: data.name,
      email: data.email,
      city: data.city || null,
      message: data.message || null,
      isPublic: data.isPublic ?? true,
    }).returning({ id: supporters.id });

    return new Response(JSON.stringify({ 
      success: true, 
      data: { id: result[0].id }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    // Handle duplicate email
    if (error.message?.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email already registered as supporter' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error('Error creating supporter:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
