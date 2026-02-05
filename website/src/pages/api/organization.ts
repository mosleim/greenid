import type { APIRoute } from 'astro';
import { db, organizations } from '../../db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.orgName || !data.orgType || !data.picName || !data.picEmail) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Organization name, type, PIC name, and PIC email are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.picEmail)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate org type
    const validTypes = ['ngo', 'community', 'company', 'government', 'academic', 'media', 'other'];
    if (!validTypes.includes(data.orgType)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid organization type' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert organization
    const result = await db.insert(organizations).values({
      name: data.orgName,
      type: data.orgType,
      picName: data.picName,
      picEmail: data.picEmail,
      website: data.website || null,
      partnershipType: data.partnershipType || null,
      status: 'pending',
    }).returning({ id: organizations.id });

    return new Response(JSON.stringify({ 
      success: true, 
      data: { id: result[0].id }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating organization:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
