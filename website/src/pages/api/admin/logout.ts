import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Delete session cookie
    cookies.delete('admin_session', {
      path: '/',
    });

    return new Response(JSON.stringify({ 
      success: true 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Location': '/admin'
      }
    });

  } catch (error) {
    console.error('Error logging out:', error);
    return new Response(JSON.stringify({ 
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
