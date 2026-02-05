import type { APIRoute } from 'astro';
import { createDbConnection, volunteers } from '../../db';

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
    if (!data.name || !data.email || !data.whatsapp || !data.role) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Name, email, WhatsApp, and role are required' 
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

    // Validate role
    const validRoles = ['Content Creator', 'Social Media Manager', 'Research Analyst', 'Web Developer', 'Community Organizer'];
    if (!validRoles.includes(data.role)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid role' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert volunteer
    const result = await db.insert(volunteers).values({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      role: data.role,
      portfolioUrl: data.portfolioUrl || null,
      availability: data.availability || null,
      motivation: data.motivation || null,
      status: 'pending',
    }).returning({ id: volunteers.id });

    return new Response(JSON.stringify({ 
      success: true, 
      data: { id: result[0].id }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email already registered as volunteer' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error('Error creating volunteer:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
