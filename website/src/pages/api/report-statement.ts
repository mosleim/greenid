import type { APIRoute } from 'astro';
import { db, statementReports } from '../../db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.politicianName || !data.sourceUrl || !data.quote) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Politician name, source URL, and quote are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate URL format
    try {
      new URL(data.sourceUrl);
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid source URL format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert report
    const result = await db.insert(statementReports).values({
      politicianName: data.politicianName,
      sourceUrl: data.sourceUrl,
      quote: data.quote,
      reporterEmail: data.reporterEmail || null,
      status: 'pending',
    }).returning({ id: statementReports.id });

    return new Response(JSON.stringify({ 
      success: true, 
      data: { id: result[0].id },
      message: 'Laporan berhasil dikirim. Kami akan memverifikasi dalam 1-3 hari kerja.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating statement report:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
