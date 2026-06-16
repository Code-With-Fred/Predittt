/**
 * AI prediction engine — calls Claude claude-sonnet-4-6 with fixture context,
 * validates the response with Zod, and writes predictions to Supabase.
 * Server-only.
 */
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';

const client = new Anthropic();

// ─── Zod schema for Claude's structured output ────────────────────────────────

const PredictionOutputSchema = z.object({
  market: z.string().min(1),
  pick: z.string().min(1),
  odds: z.number().min(1).max(50),
  confidence: z.number().int().min(1).max(100),
  reasoning: z.string().min(20),
  visibility: z.enum(['free', 'vip', 'premium']),
});

type PredictionOutput = z.infer<typeof PredictionOutputSchema>;

interface FixtureContext {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoffAt: string;
  stats?: Record<string, unknown>;
}

// ─── Core generation ──────────────────────────────────────────────────────────

export async function generatePrediction(
  fixture: FixtureContext,
  tipsterId: string,
  maxRetries = 3,
): Promise<{ id: string } | null> {
  const svc = createServiceClient();

  const prompt = buildPrompt(fixture);
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
        system: SYSTEM_PROMPT,
      });

      const text = message.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');

      const json = extractJson(text);
      const parsed = PredictionOutputSchema.safeParse(json);

      if (!parsed.success) {
        lastError = new Error(`Zod validation failed: ${parsed.error.message}`);
        console.warn(`[predict] attempt ${attempt} validation error`, parsed.error.issues);
        continue;
      }

      const prediction = parsed.data;

      const { data, error } = await svc
        .from('predictions')
        .insert({
          fixture_id: fixture.id,
          tipster_id: tipsterId,
          source: 'ai',
          market: prediction.market,
          pick: prediction.pick,
          odds: prediction.odds,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
          visibility: prediction.visibility,
          price_ngn: prediction.visibility === 'premium' ? 500 : null,
          status: 'pending',
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error || !data) {
        lastError = new Error(`DB insert failed: ${error?.message}`);
        continue;
      }

      return { id: data.id };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[predict] attempt ${attempt} error`, lastError.message);
    }
  }

  console.error(`[predict] all ${maxRetries} attempts failed:`, lastError?.message);
  return null;
}

// ─── Batch generation for all upcoming fixtures ───────────────────────────────

export async function generatePredictionsForUpcoming(tipsterId: string) {
  const svc = createServiceClient();

  const tomorrow = new Date(Date.now() + 86400_000).toISOString().slice(0, 10);
  const in3Days = new Date(Date.now() + 3 * 86400_000).toISOString();

  const { data: fixtures } = await svc
    .from('fixtures')
    .select(`
      id, kickoff_at, stats,
      home_team:teams!home_team_id (name),
      away_team:teams!away_team_id (name),
      league:leagues!league_id (name)
    `)
    .eq('status', 'scheduled')
    .lte('kickoff_at', in3Days)
    .gte('kickoff_at', new Date().toISOString());

  if (!fixtures?.length) return { generated: 0 };

  // Skip fixtures that already have an AI prediction
  const { data: existing } = await svc
    .from('predictions')
    .select('fixture_id')
    .eq('tipster_id', tipsterId)
    .eq('source', 'ai')
    .in('fixture_id', fixtures.map((f) => f.id));

  const coveredIds = new Set((existing ?? []).map((p) => p.fixture_id));
  const toGenerate = fixtures.filter((f) => !coveredIds.has(f.id));

  let generated = 0;
  for (const f of toGenerate) {
    type FixtureRow = typeof f & {
      home_team: { name: string };
      away_team: { name: string };
      league: { name: string };
    };
    const row = f as unknown as FixtureRow;
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
    if (result) generated++;
    // Gentle rate limit — 3 rpm for Claude claude-sonnet-4-6
    await new Promise((r) => setTimeout(r, 1000));
  }

  return { generated };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPrompt(fixture: FixtureContext): string {
  return `Analyse this football fixture and return a JSON prediction object.

Fixture: ${fixture.homeTeam} vs ${fixture.awayTeam}
League: ${fixture.league}
Kick-off: ${fixture.kickoffAt}
${fixture.stats ? `\nRecent stats / form data:\n${JSON.stringify(fixture.stats, null, 2)}` : ''}

Return ONLY a JSON object with these exact fields:
{
  "market": "1X2" | "Over/Under 2.5" | "BTTS" | "Correct Score" | ...,
  "pick": the specific selection (e.g. "Home Win", "Over 2.5", "Yes"),
  "odds": decimal odds as a number (e.g. 1.85),
  "confidence": integer 1-100,
  "reasoning": 2-3 sentence explanation citing specific stats or form,
  "visibility": "free" | "vip" | "premium"
}

Rules:
- Only use visibility "premium" for high-confidence niche markets (correct score, etc.)
- Use "vip" for sharp angles with confidence >= 70
- Use "free" otherwise
- Do not wrap in markdown. Return raw JSON only.`;
}

function extractJson(text: string): unknown {
  // Strip any accidental markdown code fences
  const cleaned = text.replace(/```json?/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt to extract a JSON object substring
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('No valid JSON found in response');
  }
}

const SYSTEM_PROMPT = `You are an expert football analyst and tipster with deep knowledge of statistics, team form, head-to-head records, and market value. You produce precise, evidence-based predictions. Always return raw JSON — never wrap in markdown.`;
