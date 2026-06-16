import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { generatePrediction, generatePredictionsForUpcoming } from '@/lib/predict';

const BodySchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('single'),
    fixtureId: z.string().uuid(),
    tipsterId: z.string().uuid(),
  }),
  z.object({
    mode: z.literal('batch'),
    tipsterId: z.string().uuid(),
  }),
]);

export async function POST(request: Request) {
  // Admin-only: must be authenticated and have a VIP profile
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const svc = createServiceClient();
  const profileResult = await svc
    .from('profiles')
    .select('is_vip')
    .eq('id', user.id)
    .single();

  const isAdmin = (profileResult.data as { is_vip: boolean } | null)?.is_vip;

  // Restrict to VIP/admin users (in production, add an explicit admin flag to profiles)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 });
  }

  if (parsed.data.mode === 'batch') {
    const result = await generatePredictionsForUpcoming(parsed.data.tipsterId);
    return NextResponse.json(result);
  }

  const { fixtureId, tipsterId } = parsed.data;

  const { data: fixture } = await svc
    .from('fixtures')
    .select(`
      id, kickoff_at, stats,
      home_team:teams!home_team_id (name),
      away_team:teams!away_team_id (name),
      league:leagues!league_id (name)
    `)
    .eq('id', fixtureId)
    .single();

  if (!fixture) {
    return NextResponse.json({ error: 'Fixture not found' }, { status: 404 });
  }

  interface FixtureRow {
    id: string;
    kickoff_at: string;
    stats: unknown;
    home_team: { name: string };
    away_team: { name: string };
    league: { name: string };
  }
  const row = fixture as unknown as FixtureRow;

  const result = await generatePrediction(
    {
      id: row.id,
      homeTeam: row.home_team.name,
      awayTeam: row.away_team.name,
      league: row.league.name,
      kickoffAt: row.kickoff_at,
      stats: row.stats as Record<string, unknown> | undefined,
    },
    tipsterId,
  );

  if (!result) {
    return NextResponse.json({ error: 'Generation failed after retries' }, { status: 500 });
  }

  return NextResponse.json({ id: result.id });
}
