import type { APIRoute } from 'astro';
import { createDbConnection, adminUsers, adminSessions } from '../../../db';
import { verifyPassword } from '../../../lib/password';
import { eq } from 'drizzle-orm';

export const prerender = false;

// Generate a simple session ID
function generateSessionId(): string {
  return crypto.randomUUID();
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    // Get env from Cloudflare runtime context
    const runtime = locals.runtime as any;
    const env = runtime?.env || {};
    
    // Create db connection with runtime env
    const db = createDbConnection({
      TURSO_DATABASE_URL: env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
    });
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.username || !data.password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Username dan password harus diisi' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find admin user
    const [adminUser] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, data.username))
      .limit(1);

    if (!adminUser) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Username atau password salah' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const validPassword = await verifyPassword(adminUser.passwordHash, data.password);

    if (!validPassword) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Username atau password salah' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create session
    const sessionId = generateSessionId();
    const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days

    await db.insert(adminSessions).values({
      id: sessionId,
      userId: adminUser.id,
      expiresAt: expiresAt,
    });

    // Update last login
    await db.update(adminUsers)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(adminUsers.id, adminUser.id));

    // Set session cookie
    cookies.set('admin_session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return new Response(JSON.stringify({ 
      success: true,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Terjadi kesalahan saat login' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
