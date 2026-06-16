/**
 * Data access layer — all Supabase queries live here.
 * Server-only: uses @supabase/ssr cookies() internally.
 * Function signatures are stable; components require zero changes.
 */
import { createClient } from '@/lib/supabase/server';
import type {
  Prediction,
  Tipster,
  Plan,
  Bookmaker,
  TrackRecordEntry,
  OverallStats,
  RoiDataPoint,
  PredictionStatus,
  Fixture,
  Team,
} from './types';

// ─── Row mappers ──────────────────────────────────────────────────────────────

type TeamRow = { id: string; name: string; logo_url: string };
type LeagueRow = { id: string; name: string; logo_url: string };
type TipsterRow = {
  id: string; display_name: string; is_ai: boolean; avatar_url: string;
  win_rate: number; roi_units: number; settled: number;
  avg_odds: number; avg_confidence: number; markets: unknown;
};
type FixtureRow = {
  id: string; kickoff_at: string; status: string;
  home_score: number | null; away_score: number | null;
  league: LeagueRow;
  home_team: TeamRow;
  away_team: TeamRow;
};
type PredictionRow = {
  id: string; source: string; market: string; pick: string;
  odds: number; confidence: number; reasoning: string;
  visibility: string; price_ngn: number | null;
  status: string; published_at: string;
  fixture: FixtureRow;
  tipster: TipsterRow;
};

function mapTeam(row: TeamRow): Team {
  return { id: row.id, name: row.name, logoUrl: row.logo_url };
}

function mapFixture(row: FixtureRow): Fixture {
  return {
    id: row.id,
    league: row.league.name,
    leagueLogo: row.league.logo_url,
    home: mapTeam(row.home_team),
    away: mapTeam(row.away_team),
    kickoffAt: row.kickoff_at,
    status: row.status as Fixture['status'],
    homeScore: row.home_score ?? undefined,
    awayScore: row.away_score ?? undefined,
  };
}

function mapTipster(row: TipsterRow): Tipster {
  return {
    id: row.id,
    displayName: row.display_name,
    isAi: row.is_ai,
    avatarUrl: row.avatar_url,
    winRate: row.win_rate,
    roiUnits: row.roi_units,
    settled: row.settled,
  };
}

function mapPrediction(row: PredictionRow): Prediction {
  return {
    id: row.id,
    fixture: mapFixture(row.fixture),
    tipster: mapTipster(row.tipster),
    source: row.source as Prediction['source'],
    market: row.market,
    pick: row.pick,
    odds: row.odds,
    confidence: row.confidence,
    reasoning: row.reasoning,
    visibility: row.visibility as Prediction['visibility'],
    price: row.price_ngn ?? 0,
    status: row.status as Prediction['status'],
    publishedAt: row.published_at,
  };
}

const PREDICTION_SELECT = `
  id, source, market, pick, odds, confidence, reasoning,
  visibility, price_ngn, status, published_at,
  fixture:fixtures!fixture_id (
    id, kickoff_at, status, home_score, away_score,
    league:leagues!league_id (id, name, logo_url),
    home_team:teams!home_team_id (id, name, logo_url),
    away_team:teams!away_team_id (id, name, logo_url)
  ),
  tipster:tipsters!tipster_id (
    id, display_name, is_ai, avatar_url,
    win_rate, roi_units, settled, avg_odds, avg_confidence, markets
  )
`;

// ─── Predictions ──────────────────────────────────────────────────────────────

export async function getTodaysPredictions(): Promise<Prediction[]> {
  const supabase = await createClient();
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('predictions')
    .select(PREDICTION_SELECT)
    .gte('fixture.kickoff_at' as never, start.toISOString())
    .lte('fixture.kickoff_at' as never, end.toISOString())
    .order('published_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as PredictionRow[]).map(mapPrediction);
}

export async function getPredictionById(id: string): Promise<Prediction | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select(PREDICTION_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapPrediction(data as unknown as PredictionRow);
}

export async function getRelatedPredictions(predictionId: string): Promise<Prediction[]> {
  const prediction = await getPredictionById(predictionId);
  if (!prediction) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select(PREDICTION_SELECT)
    .neq('id', predictionId)
    .order('published_at', { ascending: false })
    .limit(6);

  if (error || !data) return [];
  const all = (data as unknown as PredictionRow[]).map(mapPrediction);
  const sameLeague = all.filter((p) => p.fixture.league === prediction.fixture.league);
  const sameTipster = all.filter((p) => p.tipster.id === prediction.tipster.id && p.fixture.league !== prediction.fixture.league);
  return [...sameLeague, ...sameTipster].slice(0, 3);
}

export async function getPredictionsByStatus(status: PredictionStatus): Promise<Prediction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select(PREDICTION_SELECT)
    .eq('status', status)
    .order('published_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as PredictionRow[]).map(mapPrediction);
}

// ─── Tipsters ─────────────────────────────────────────────────────────────────

export async function getTipsters(): Promise<Tipster[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tipsters')
    .select('id, display_name, is_ai, avatar_url, win_rate, roi_units, settled, avg_odds, avg_confidence, markets')
    .order('win_rate', { ascending: false });

  if (error || !data) return [];
  return (data as TipsterRow[]).map(mapTipster);
}

export async function getTipsterById(id: string): Promise<Tipster | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tipsters')
    .select('id, display_name, is_ai, avatar_url, win_rate, roi_units, settled, avg_odds, avg_confidence, markets')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapTipster(data as TipsterRow);
}

export async function getTipsterPredictions(tipsterId: string): Promise<Prediction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select(PREDICTION_SELECT)
    .eq('tipster_id', tipsterId)
    .order('published_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as PredictionRow[]).map(mapPrediction);
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export async function getPlans(): Promise<Plan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('id, name, currency, amount_kobo, plan_interval, features, is_popular, paystack_plan_code')
    .order('amount_kobo', { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    currency: row.currency as 'NGN' | 'USD',
    // Convert kobo → naira (or cents → dollars)
    amount: row.amount_kobo / 100,
    interval: row.plan_interval as 'monthly' | 'yearly',
    features: row.features ?? [],
    popular: row.is_popular,
  }));
}

// ─── Bookmakers ───────────────────────────────────────────────────────────────

export async function getBookmakers(): Promise<Bookmaker[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookmakers')
    .select('id, name, logo_url, affiliate_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    affiliateUrl: row.affiliate_url,
  }));
}

// ─── Track Record ─────────────────────────────────────────────────────────────

export async function getTrackRecord(filters?: {
  tipster?: string;
  market?: string;
  result?: PredictionStatus;
}): Promise<TrackRecordEntry[]> {
  const supabase = await createClient();

  let query = supabase
    .from('predictions')
    .select(`
      id, market, pick, odds, status, settled_at, published_at,
      fixture:fixtures!fixture_id (
        id,
        home_team:teams!home_team_id (name),
        away_team:teams!away_team_id (name)
      ),
      tipster:tipsters!tipster_id (id, display_name)
    `)
    .in('status', ['won', 'lost', 'void'])
    .order('settled_at', { ascending: false })
    .limit(200);

  if (filters?.market) query = query.eq('market', filters.market);
  if (filters?.result) query = query.eq('status', filters.result);

  const { data, error } = await query;
  if (error || !data) return [];

  type TrackRow = {
    id: string; market: string; pick: string; odds: number;
    status: string; settled_at: string | null; published_at: string;
    fixture: { id: string; home_team: { name: string }; away_team: { name: string } };
    tipster: { id: string; display_name: string };
  };

  let rows = data as unknown as TrackRow[];
  if (filters?.tipster) {
    rows = rows.filter((r) => r.tipster.display_name === filters.tipster);
  }

  return rows.map((row) => ({
    id: row.id,
    date: (row.settled_at ?? row.published_at).slice(0, 10),
    fixture: `${row.fixture.home_team.name} v ${row.fixture.away_team.name}`,
    pick: row.pick,
    market: row.market,
    odds: row.odds,
    result: row.status as PredictionStatus,
    tipster: row.tipster.display_name,
    roiDelta: row.status === 'won' ? row.odds - 1 : row.status === 'lost' ? -1 : 0,
  }));
}

export async function getOverallStats(): Promise<OverallStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select('status, odds, settled_at')
    .in('status', ['won', 'lost', 'void']);

  if (error || !data || data.length === 0) {
    return { winRate: 0, totalPicks: 0, settledPicks: 0, roiUnits: 0, streak: 0, streakType: 'won', last30WinRate: 0, avgOdds: 0 };
  }

  const settled = data.filter((r) => r.status !== 'void');
  const wins = settled.filter((r) => r.status === 'won');
  const winRate = settled.length > 0 ? Math.round((wins.length / settled.length) * 100) : 0;
  const roiUnits = settled.reduce((acc, r) => acc + (r.status === 'won' ? r.odds - 1 : -1), 0);
  const avgOdds = settled.length > 0 ? settled.reduce((acc, r) => acc + r.odds, 0) / settled.length : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const last30 = settled.filter((r) => r.settled_at && new Date(r.settled_at) >= thirtyDaysAgo);
  const last30Wins = last30.filter((r) => r.status === 'won');
  const last30WinRate = last30.length > 0 ? Math.round((last30Wins.length / last30.length) * 100) : 0;

  // Compute current streak from most recent settled picks
  const sorted = [...settled].sort((a, b) =>
    new Date(b.settled_at!).getTime() - new Date(a.settled_at!).getTime()
  );
  let streak = 0;
  const streakType = (sorted[0]?.status ?? 'won') as 'won' | 'lost';
  for (const r of sorted) {
    if (r.status === streakType) streak++;
    else break;
  }

  return {
    winRate,
    totalPicks: data.length,
    settledPicks: settled.length,
    roiUnits: Math.round(roiUnits * 100) / 100,
    streak,
    streakType,
    last30WinRate,
    avgOdds: Math.round(avgOdds * 100) / 100,
  };
}

export async function getRoiChartData(): Promise<RoiDataPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select('status, odds, settled_at')
    .in('status', ['won', 'lost'])
    .not('settled_at', 'is', null)
    .order('settled_at', { ascending: true })
    .limit(365);

  if (error || !data) return [];

  let cumulative = 0;
  return data.map((row) => {
    const roi = row.status === 'won' ? row.odds - 1 : -1;
    cumulative += roi;
    return {
      date: row.settled_at!.slice(0, 10),
      roi: Math.round(roi * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
    };
  });
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  plan: 'free' | 'vip';
  unlockedPremiumIds: string[];
  savedFixtureIds: string[];
}

export async function getMockUser(): Promise<MockUser> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      id: '',
      email: '',
      displayName: 'Guest',
      avatarUrl: '',
      plan: 'free',
      unlockedPremiumIds: [],
      savedFixtureIds: [],
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, is_vip, saved_fixture_ids')
    .eq('id', user.id)
    .single();

  const { data: purchases } = await supabase
    .from('tip_purchases')
    .select('prediction_id')
    .eq('user_id', user.id)
    .eq('status', 'success');

  return {
    id: user.id,
    email: user.email ?? '',
    displayName: profile?.display_name ?? user.email?.split('@')[0] ?? 'User',
    avatarUrl: profile?.avatar_url ?? '',
    plan: profile?.is_vip ? 'vip' : 'free',
    unlockedPremiumIds: (purchases ?? []).map((p) => p.prediction_id),
    savedFixtureIds: profile?.saved_fixture_ids ?? [],
  };
}
