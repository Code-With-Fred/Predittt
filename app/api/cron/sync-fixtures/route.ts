import { NextResponse } from 'next/server';
import { syncFixtures } from '@/lib/sportsdata';

// Vercel cron: every day at 06:00 UTC
export const dynamic = 'force-dynamic';

const LEAGUES = [
  { id: 39, season: 2024 },  // EPL
  { id: 140, season: 2024 }, // La Liga
  { id: 2, season: 2024 },   // UCL
  { id: 332, season: 2024 }, // NPFL
];

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const errors: string[] = [];

  for (const league of LEAGUES) {
    try {
      await syncFixtures(league.id, league.season);
    } catch (err) {
      errors.push(`league ${league.id}: ${String(err)}`);
    }
  }

  if (errors.length > 0) {
    console.error('[sync-fixtures] errors:', errors);
    return NextResponse.json({ ok: false, errors }, { status: 207 });
  }

  return NextResponse.json({ ok: true, synced: LEAGUES.length });
}
