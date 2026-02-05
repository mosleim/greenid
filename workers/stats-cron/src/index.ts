// Cloudflare Worker untuk regenerate stats ke R2
// Dijalankan via cron trigger setiap 5 menit

import { createClient } from '@libsql/client/web';

interface Env {
  BUYBACK_CACHE: R2Bucket;
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
}

interface Stats {
  supporters: number;
  influencers: number;
  totalImpressions: number;
  politicians: number;
  politiciansPro: number;
  politiciansKontra: number;
  politiciansNetral: number;
  lastUpdated: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Allow manual trigger via HTTP request
    const url = new URL(request.url);
    
    if (url.pathname === '/stats') {
      // Serve cached stats from R2
      const cached = await env.BUYBACK_CACHE.get('stats.json');
      if (cached) {
        return new Response(await cached.text(), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=60',
          },
        });
      }
      return new Response(JSON.stringify({ error: 'Stats not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (url.pathname === '/refresh') {
      // Manual refresh trigger
      const stats = await this.generateStats(env);
      return new Response(JSON.stringify(stats), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    return new Response('Buyback Stats Worker', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Cron trigger - regenerate stats
    ctx.waitUntil(this.generateStats(env));
  },

  async generateStats(env: Env): Promise<Stats> {
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    try {
      // Count supporters
      const supportersResult = await client.execute('SELECT COUNT(*) as count FROM supporters');
      const supporters = Number(supportersResult.rows[0]?.count || 0);

      // Count influencers
      const influencersResult = await client.execute('SELECT COUNT(*) as count FROM influencers');
      const influencers = Number(influencersResult.rows[0]?.count || 0);

      // Sum impressions (using followers_count as proxy)
      const impressionsResult = await client.execute(
        'SELECT COALESCE(SUM(followers_count), 0) as total FROM influencers'
      );
      const totalImpressions = Number(impressionsResult.rows[0]?.total || 0);

      // Count politicians
      const politiciansResult = await client.execute('SELECT COUNT(*) as count FROM politicians');
      const politicians = Number(politiciansResult.rows[0]?.count || 0);

      // Count politicians by sentiment (based on latest statement)
      const sentimentResult = await client.execute(`
        WITH latest_statements AS (
          SELECT 
            politician_id,
            sentiment,
            ROW_NUMBER() OVER (PARTITION BY politician_id ORDER BY statement_date DESC) as rn
          FROM statements
        )
        SELECT 
          COALESCE(SUM(CASE WHEN sentiment = 'pro' THEN 1 ELSE 0 END), 0) as pro,
          COALESCE(SUM(CASE WHEN sentiment = 'kontra' THEN 1 ELSE 0 END), 0) as kontra,
          COALESCE(SUM(CASE WHEN sentiment = 'netral' THEN 1 ELSE 0 END), 0) as netral
        FROM latest_statements
        WHERE rn = 1
      `);

      const politiciansPro = Number(sentimentResult.rows[0]?.pro || 0);
      const politiciansKontra = Number(sentimentResult.rows[0]?.kontra || 0);
      const politiciansNetral = Number(sentimentResult.rows[0]?.netral || 0);

      const stats: Stats = {
        supporters,
        influencers,
        totalImpressions,
        politicians,
        politiciansPro,
        politiciansKontra,
        politiciansNetral,
        lastUpdated: new Date().toISOString(),
      };

      // Save to R2
      await env.BUYBACK_CACHE.put('stats.json', JSON.stringify(stats), {
        httpMetadata: {
          contentType: 'application/json',
        },
      });

      console.log('Stats updated:', stats);
      return stats;

    } catch (error) {
      console.error('Error generating stats:', error);
      throw error;
    }
  },
};
