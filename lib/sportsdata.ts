/**
 * API-Football (api-sports.io) integration.
 * Fetches fixtures + stats and upserts into Supabase.
 * Server-only — uses service role client.
 */
import { createServiceClient } from '@/lib/supabase/service';

const API_BASE = 'https://v3.football.api-sports.io';

async function apiFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': process.env.API_FOOTBALL_KEY!,
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`API-Football error ${res.status}: ${path}`);
  const json = await res.json();
  return json.response as T;
}

interface ApiTeam {
  team: { id: number; name: string; logo: string };
}

interface ApiLeague {
  league: { id: number; name: string; logo: string };
  country: { name: string };
  seasons: { year: number }[];
}

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  league: { id: number; name: string; logo: string; country: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
  score: unknown;
  statistics?: unknown[];
}

interface ApiStatEntry {
  team: { id: number };
  statistics: { type: string; value: unknown }[];
}

// ─── Team sync ────────────────────────────────────────────────────────────────

export async function syncLeagueTeams(leagueId: number, season: number) {
  const svc = createServiceClient();
  const rows = await apiFetch<ApiTeam[]>('/teams', { league: leagueId, season });

  for (const row of rows) {
    await svc.from('teams').upsert({
      name: row.team.name,
      logo_url: row.team.logo,
      api_football_id: row.team.id,
    }, { onConflict: 'api_football_id' });
  }
}

// ─── Fixture sync ─────────────────────────────────────────────────────────────

export async function syncFixtures(leagueId: number, season: number) {
  const svc = createServiceClient();

  const { data: leagueRow } = await svc
    .from('leagues')
    .select('id')
    .eq('api_football_id', leagueId)
    .maybeSingle();

  if (!leagueRow) {
    console.warn(`League with api_football_id=${leagueId} not found. Seed leagues first.`);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const in7Days = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);

  const fixtures = await apiFetch<ApiFixture[]>('/fixtures', {
    league: leagueId,
    season,
    from: today,
    to: in7Days,
  });

  for (const f of fixtures) {
    const [homeTeam, awayTeam] = await Promise.all([
      resolveTeam(svc, f.teams.home.id, f.teams.home.name, f.teams.home.logo),
      resolveTeam(svc, f.teams.away.id, f.teams.away.name, f.teams.away.logo),
    ]);
    if (!homeTeam || !awayTeam) continue;

    await svc.from('fixtures').upsert({
      league_id: leagueRow.id,
      home_team_id: homeTeam,
      away_team_id: awayTeam,
      kickoff_at: f.fixture.date,
      status: mapFixtureStatus(f.fixture.status.short),
      home_score: f.goals.home,
      away_score: f.goals.away,
      api_football_id: f.fixture.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'api_football_id' });
  }
}

// ─── Stats sync (called after fixture is finished) ────────────────────────────

export async function syncFixtureStats(apiFixtureId: number) {
  const svc = createServiceClient();

  const stats = await apiFetch<ApiStatEntry[]>('/fixtures/statistics', {
    fixture: apiFixtureId,
  });

  const { data: fixture } = await svc
    .from('fixtures')
    .select('id')
    .eq('api_football_id', apiFixtureId)
    .maybeSingle();

  if (!fixture) return;

  await svc.from('fixtures').update({
    stats: stats as never,
    updated_at: new Date().toISOString(),
  }).eq('id', fixture.id);
}

// ─── Settle predictions ───────────────────────────────────────────────────────

export async function settleFinishedFixtures() {
  const svc = createServiceClient();

  const { data: finished } = await svc
    .from('fixtures')
    .select('id, home_score, away_score')
    .eq('status', 'finished');

  if (!finished?.length) return;

  const fixtureIds = finished.map((f) => f.id);

  const { data: pending } = await svc
    .from('predictions')
    .select('id, fixture_id, market, pick, odds, tipster_id')
    .eq('status', 'pending')
    .in('fixture_id', fixtureIds);

  if (!pending?.length) return;

  const fixtureMap = new Map(finished.map((f) => [f.id, f]));
  const affectedTipsters = new Set<string>();

  for (const pred of pending) {
    const fixture = fixtureMap.get(pred.fixture_id);
    if (!fixture || fixture.home_score == null || fixture.away_score == null) continue;

    const result = evaluatePrediction(pred, fixture.home_score, fixture.away_score);
    await svc.from('predictions').update({
      status: result,
      settled_at: new Date().toISOString(),
    }).eq('id', pred.id);

    affectedTipsters.add(pred.tipster_id);
  }

  // Recompute tipster accuracy
  for (const tipsterId of affectedTipsters) {
    await svc.rpc('tipster_accuracy', { p_tipster_id: tipsterId });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function resolveTeam(
  svc: ReturnType<typeof createServiceClient>,
  apiId: number,
  name: string,
  logo: string,
): Promise<string | null> {
  const { data } = await svc
    .from('teams')
    .upsert({ name, logo_url: logo, api_football_id: apiId }, { onConflict: 'api_football_id' })
    .select('id')
    .single();
  return data?.id ?? null;
}

function mapFixtureStatus(short: string): 'scheduled' | 'live' | 'finished' {
  if (['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(short)) return 'finished';
  if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(short)) return 'live';
  return 'scheduled';
}

function evaluatePrediction(
  pred: { market: string; pick: string },
  homeScore: number,
  awayScore: number,
): 'won' | 'lost' | 'void' {
  const total = homeScore + awayScore;
  const market = pred.market.toLowerCase();
  const pick = pred.pick.toLowerCase();

  if (market === '1x2') {
    if (pick === 'home win' || pick === '1') return homeScore > awayScore ? 'won' : 'lost';
    if (pick === 'draw' || pick === 'x') return homeScore === awayScore ? 'won' : 'lost';
    if (pick === 'away win' || pick === '2') return awayScore > homeScore ? 'won' : 'lost';
  }
  if (market.startsWith('over') || pick.startsWith('over')) {
    const line = parseFloat(market.replace(/[^0-9.]/g, '') || pick.replace(/[^0-9.]/g, ''));
    return total > line ? 'won' : 'lost';
  }
  if (market.startsWith('under') || pick.startsWith('under')) {
    const line = parseFloat(market.replace(/[^0-9.]/g, '') || pick.replace(/[^0-9.]/g, ''));
    return total < line ? 'won' : 'lost';
  }
  if (market === 'btts' || market === 'both teams to score') {
    const btts = homeScore > 0 && awayScore > 0;
    return (pick === 'yes' ? btts : !btts) ? 'won' : 'lost';
  }
  if (market === 'correct score') {
    const [h, a] = pick.split('-').map(Number);
    return h === homeScore && a === awayScore ? 'won' : 'lost';
  }

  return 'void';
}
