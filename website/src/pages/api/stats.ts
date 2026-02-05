import type { APIRoute } from 'astro';
import { db, supporters, influencers, politicians, statements } from '../../db';
import { count, sum, sql } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Get supporter count
    const supporterCount = await db
      .select({ count: count() })
      .from(supporters);

    // Get influencer stats
    const influencerStats = await db
      .select({ 
        count: count(),
        totalFollowers: sum(influencers.followersCount),
        totalImpact: sum(influencers.impactScore)
      })
      .from(influencers);

    // Get politician stats
    const politicianCount = await db
      .select({ count: count() })
      .from(politicians);

    // Get statement stats by sentiment
    const statementStats = await db
      .select({ 
        sentiment: statements.sentiment,
        count: count()
      })
      .from(statements)
      .groupBy(statements.sentiment);

    // Calculate estimated impressions (simplified formula)
    const totalFollowers = Number(influencerStats[0]?.totalFollowers || 0);
    const estimatedImpressions = totalFollowers * 0.1; // 10% reach estimate

    const stats = {
      supporters: supporterCount[0]?.count || 0,
      influencers: influencerStats[0]?.count || 0,
      totalFollowersReach: totalFollowers,
      estimatedImpressions: Math.round(estimatedImpressions),
      politicians: politicianCount[0]?.count || 0,
      statements: {
        total: statementStats.reduce((acc, s) => acc + (s.count || 0), 0),
        pro: statementStats.find(s => s.sentiment === 'pro')?.count || 0,
        kontra: statementStats.find(s => s.sentiment === 'kontra')?.count || 0,
        netral: statementStats.find(s => s.sentiment === 'netral')?.count || 0,
      },
      lastUpdated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Return fallback stats if database error
    const fallbackStats = {
      supporters: 0,
      influencers: 0,
      totalFollowersReach: 0,
      estimatedImpressions: 0,
      politicians: 0,
      statements: { total: 0, pro: 0, kontra: 0, netral: 0 },
      lastUpdated: new Date().toISOString(),
      error: true
    };

    return new Response(JSON.stringify(fallbackStats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
