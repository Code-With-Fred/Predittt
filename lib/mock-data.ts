import type {
  Tipster,
  Prediction,
  Plan,
  Bookmaker,
  TrackRecordEntry,
  OverallStats,
  RoiDataPoint,
} from './types';

// ─── Tipsters ────────────────────────────────────────────────────────────────

export const mockTipsters: Tipster[] = [
  {
    id: 'ai-alpha',
    displayName: 'AlphaModel v3',
    isAi: true,
    avatarUrl: '/avatars/ai-alpha.svg',
    winRate: 71.4,
    roiUnits: 28.6,
    settled: 210,
  },
  {
    id: 'ai-sigma',
    displayName: 'SigmaAI Pro',
    isAi: true,
    avatarUrl: '/avatars/ai-sigma.svg',
    winRate: 68.2,
    roiUnits: 21.3,
    settled: 183,
  },
  {
    id: 'expert-chukwu',
    displayName: 'ChukwuAnalyst',
    isAi: false,
    avatarUrl: '/avatars/chukwu.svg',
    winRate: 65.0,
    roiUnits: 17.8,
    settled: 140,
  },
  {
    id: 'expert-tunde',
    displayName: 'TundeFC',
    isAi: false,
    avatarUrl: '/avatars/tunde.svg',
    winRate: 62.7,
    roiUnits: 14.2,
    settled: 118,
  },
  {
    id: 'expert-amaka',
    displayName: 'AmakaStats',
    isAi: false,
    avatarUrl: '/avatars/amaka.svg',
    winRate: 60.1,
    roiUnits: 11.5,
    settled: 97,
  },
];

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const now = new Date();
const inHours = (h: number) => new Date(now.getTime() + h * 3_600_000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();

// ─── Predictions ──────────────────────────────────────────────────────────────

export const mockPredictions: Prediction[] = [
  // 1 — EPL, free, pending
  {
    id: 'pred-001',
    fixture: {
      id: 'fix-001',
      league: 'Premier League',
      leagueLogo: '/leagues/epl.svg',
      home: { id: 'ars', name: 'Arsenal', logoUrl: '/teams/arsenal.svg' },
      away: { id: 'che', name: 'Chelsea', logoUrl: '/teams/chelsea.svg' },
      kickoffAt: inHours(2),
      status: 'scheduled',
    },
    tipster: mockTipsters[0],
    source: 'ai',
    market: '1X2',
    pick: 'Home Win',
    odds: 1.95,
    confidence: 74,
    reasoning:
      'Arsenal have won 7 of their last 9 home fixtures in the league, averaging 2.3 goals scored. Chelsea\'s away defensive record is poor — they\'ve conceded in each of their last 6 away trips. Key metric: xG difference over last 5 home/away pairings favours Arsenal by +0.8 per game.',
    visibility: 'free',
    price: 0,
    status: 'pending',
    publishedAt: hoursAgo(1),
  },
  // 2 — La Liga, vip, pending
  {
    id: 'pred-002',
    fixture: {
      id: 'fix-002',
      league: 'La Liga',
      leagueLogo: '/leagues/laliga.svg',
      home: { id: 'bar', name: 'Barcelona', logoUrl: '/teams/barcelona.svg' },
      away: { id: 'atm', name: 'Atletico Madrid', logoUrl: '/teams/atletico.svg' },
      kickoffAt: inHours(4.5),
      status: 'scheduled',
    },
    tipster: mockTipsters[1],
    source: 'ai',
    market: 'BTTS',
    pick: 'Yes',
    odds: 1.72,
    confidence: 81,
    reasoning:
      'Both sides have scored in 8 of their last 10 encounters. Barcelona\'s high defensive line leaves them vulnerable in transition — Atletico exploit this with counter-press. BTTS has hit in 5 consecutive Barcelona home games.',
    visibility: 'vip',
    price: 0,
    status: 'pending',
    publishedAt: hoursAgo(0.5),
  },
  // 3 — Champions League, premium, pending
  {
    id: 'pred-003',
    fixture: {
      id: 'fix-003',
      league: 'UEFA Champions League',
      leagueLogo: '/leagues/ucl.svg',
      home: { id: 'bay', name: 'Bayern Munich', logoUrl: '/teams/bayern.svg' },
      away: { id: 'psg', name: 'Paris Saint-Germain', logoUrl: '/teams/psg.svg' },
      kickoffAt: inHours(6),
      status: 'scheduled',
    },
    tipster: mockTipsters[0],
    source: 'hybrid',
    market: 'OU2.5',
    pick: 'Over 2.5',
    odds: 1.65,
    confidence: 88,
    reasoning:
      'Historical head-to-head: 6 of the last 7 meetings produced 3+ goals. Bayern\'s Allianz Arena xG output this UCL campaign is 2.6 per game. PSG concede on average 1.4 per away UCL fixture. Model confidence elevated by injury report — defensive key man Marquinhos rated 65% fit.',
    visibility: 'premium',
    price: 1500,
    status: 'pending',
    publishedAt: hoursAgo(2),
  },
  // 4 — NPFL, free, won
  {
    id: 'pred-004',
    fixture: {
      id: 'fix-004',
      league: 'NPFL',
      leagueLogo: '/leagues/npfl.svg',
      home: { id: 'eny', name: 'Enyimba FC', logoUrl: '/teams/enyimba.svg' },
      away: { id: 'kwa', name: 'Kwara United', logoUrl: '/teams/kwara.svg' },
      kickoffAt: hoursAgo(26),
      status: 'finished',
      homeScore: 2,
      awayScore: 0,
    },
    tipster: mockTipsters[2],
    source: 'manual',
    market: '1X2',
    pick: 'Home Win',
    odds: 1.85,
    confidence: 78,
    reasoning:
      'Enyimba are unbeaten in 9 consecutive home NPFL games, with an average margin of 1.7 goals. Kwara United have lost 4 of their last 5 away fixtures. Situational edge: Enyimba chasing title — high motivation.',
    visibility: 'free',
    price: 0,
    status: 'won',
    publishedAt: hoursAgo(30),
  },
  // 5 — EPL, vip, won
  {
    id: 'pred-005',
    fixture: {
      id: 'fix-005',
      league: 'Premier League',
      leagueLogo: '/leagues/epl.svg',
      home: { id: 'mci', name: 'Manchester City', logoUrl: '/teams/mancity.svg' },
      away: { id: 'bur', name: 'Burnley', logoUrl: '/teams/burnley.svg' },
      kickoffAt: hoursAgo(50),
      status: 'finished',
      homeScore: 3,
      awayScore: 1,
    },
    tipster: mockTipsters[0],
    source: 'ai',
    market: 'OU2.5',
    pick: 'Over 2.5',
    odds: 1.55,
    confidence: 91,
    reasoning:
      'Manchester City have produced 3+ goals in 11 of 14 home games this season. Burnley\'s defensive metrics rank bottom-4 in the league. Over 2.5 landed in the last 6 City vs. bottom-half matchups.',
    visibility: 'vip',
    price: 0,
    status: 'won',
    publishedAt: hoursAgo(54),
  },
  // 6 — La Liga, premium, lost
  {
    id: 'pred-006',
    fixture: {
      id: 'fix-006',
      league: 'La Liga',
      leagueLogo: '/leagues/laliga.svg',
      home: { id: 'rma', name: 'Real Madrid', logoUrl: '/teams/realmadrid.svg' },
      away: { id: 'sev', name: 'Sevilla', logoUrl: '/teams/sevilla.svg' },
      kickoffAt: hoursAgo(74),
      status: 'finished',
      homeScore: 0,
      awayScore: 1,
    },
    tipster: mockTipsters[1],
    source: 'ai',
    market: '1X2',
    pick: 'Home Win',
    odds: 1.45,
    confidence: 82,
    reasoning:
      'Real Madrid have won 10 of 12 home La Liga games. Sevilla in 7th with poor away form. Model projected 78% win probability for Real.',
    visibility: 'premium',
    price: 2000,
    status: 'lost',
    publishedAt: hoursAgo(78),
  },
  // 7 — UCL, free, pending (tomorrow)
  {
    id: 'pred-007',
    fixture: {
      id: 'fix-007',
      league: 'UEFA Champions League',
      leagueLogo: '/leagues/ucl.svg',
      home: { id: 'int', name: 'Inter Milan', logoUrl: '/teams/inter.svg' },
      away: { id: 'por', name: 'FC Porto', logoUrl: '/teams/porto.svg' },
      kickoffAt: inHours(28),
      status: 'scheduled',
    },
    tipster: mockTipsters[2],
    source: 'manual',
    market: 'BTTS',
    pick: 'No',
    odds: 2.10,
    confidence: 61,
    reasoning:
      'Porto\'s attack has been muted in European competition, scoring just 3 in their last 5 UCL away games. Inter\'s defensive structure under pressure is elite — 5 UCL clean sheets at home this campaign.',
    visibility: 'free',
    price: 0,
    status: 'pending',
    publishedAt: hoursAgo(0.25),
  },
  // 8 — La Liga, vip, pending
  {
    id: 'pred-008',
    fixture: {
      id: 'fix-008',
      league: 'La Liga',
      leagueLogo: '/leagues/laliga.svg',
      home: { id: 'val', name: 'Valencia', logoUrl: '/teams/valencia.svg' },
      away: { id: 'vil', name: 'Villarreal', logoUrl: '/teams/villarreal.svg' },
      kickoffAt: inHours(3),
      status: 'scheduled',
    },
    tipster: mockTipsters[3],
    source: 'manual',
    market: '1X2',
    pick: 'Draw',
    odds: 3.20,
    confidence: 55,
    reasoning:
      'Both teams are mid-table without European ambitions — tactical caution expected. H2H: 3 of last 5 meetings ended level. Bookmaker line drift toward draw since line open.',
    visibility: 'vip',
    price: 0,
    status: 'pending',
    publishedAt: hoursAgo(1.5),
  },
  // 9 — NPFL, premium, won
  {
    id: 'pred-009',
    fixture: {
      id: 'fix-009',
      league: 'NPFL',
      leagueLogo: '/leagues/npfl.svg',
      home: { id: 'riv', name: 'Rivers United', logoUrl: '/teams/rivers.svg' },
      away: { id: 'hea', name: 'Heartland FC', logoUrl: '/teams/heartland.svg' },
      kickoffAt: hoursAgo(50),
      status: 'finished',
      homeScore: 2,
      awayScore: 1,
    },
    tipster: mockTipsters[0],
    source: 'ai',
    market: 'OU2.5',
    pick: 'Over 2.5',
    odds: 2.05,
    confidence: 69,
    reasoning:
      'Both sides average 2.8 total goals per home/away game respectively. Last 3 head-to-head encounters averaged 3.7 goals. Pitch conditions at Rumuola Stadium favour open play.',
    visibility: 'premium',
    price: 1200,
    status: 'won',
    publishedAt: hoursAgo(54),
  },
  // 10 — EPL, free, won
  {
    id: 'pred-010',
    fixture: {
      id: 'fix-010',
      league: 'Premier League',
      leagueLogo: '/leagues/epl.svg',
      home: { id: 'tot', name: 'Tottenham', logoUrl: '/teams/tottenham.svg' },
      away: { id: 'new', name: 'Newcastle', logoUrl: '/teams/newcastle.svg' },
      kickoffAt: hoursAgo(98),
      status: 'finished',
      homeScore: 1,
      awayScore: 2,
    },
    tipster: mockTipsters[4],
    source: 'manual',
    market: '1X2',
    pick: 'Away Win',
    odds: 2.75,
    confidence: 58,
    reasoning:
      'Newcastle\'s European qualification push gives them strong motivation. Tottenham in form dip — 1 win in last 5. Eddie Howe\'s away record at top-6 sides has improved significantly.',
    visibility: 'free',
    price: 0,
    status: 'won',
    publishedAt: hoursAgo(102),
  },
  // 11 — UCL, vip, lost
  {
    id: 'pred-011',
    fixture: {
      id: 'fix-011',
      league: 'UEFA Champions League',
      leagueLogo: '/leagues/ucl.svg',
      home: { id: 'atm', name: 'Atletico Madrid', logoUrl: '/teams/atletico.svg' },
      away: { id: 'dor', name: 'Borussia Dortmund', logoUrl: '/teams/dortmund.svg' },
      kickoffAt: hoursAgo(122),
      status: 'finished',
      homeScore: 1,
      awayScore: 2,
    },
    tipster: mockTipsters[1],
    source: 'ai',
    market: '1X2',
    pick: 'Home Win',
    odds: 1.80,
    confidence: 72,
    reasoning:
      'Atletico\'s Wanda Metropolitano fortress has proven decisive in European knockout games. Dortmund\'s away UCL record was historically brittle.',
    visibility: 'vip',
    price: 0,
    status: 'lost',
    publishedAt: hoursAgo(126),
  },
  // 12 — EPL, premium, pending
  {
    id: 'pred-012',
    fixture: {
      id: 'fix-012',
      league: 'Premier League',
      leagueLogo: '/leagues/epl.svg',
      home: { id: 'liv', name: 'Liverpool', logoUrl: '/teams/liverpool.svg' },
      away: { id: 'mun', name: 'Manchester United', logoUrl: '/teams/manutd.svg' },
      kickoffAt: inHours(7),
      status: 'scheduled',
    },
    tipster: mockTipsters[0],
    source: 'hybrid',
    market: 'Correct Score',
    pick: '2-0',
    odds: 7.50,
    confidence: 38,
    reasoning:
      'Model identifies Liverpool clean sheet probability at 52% in this matchup based on current form and United\'s attacking metrics. Most probable winning scoreline for Liverpool given xG distributions is 2-0 (17.4% occurrence in simulations).',
    visibility: 'premium',
    price: 3000,
    status: 'pending',
    publishedAt: hoursAgo(0.75),
  },
];

// ─── Plans ────────────────────────────────────────────────────────────────────

export const mockPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    currency: 'NGN',
    amount: 0,
    interval: 'monthly',
    features: [
      'Up to 3 free picks per day',
      'Basic win-rate stats',
      'Bookmaker odds comparison',
      'Community access',
    ],
  },
  {
    id: 'vip-monthly',
    name: 'VIP',
    currency: 'NGN',
    amount: 4999,
    interval: 'monthly',
    popular: true,
    features: [
      'All free picks',
      'Unlimited VIP picks daily',
      'Full reasoning & analysis',
      'AI model predictions',
      'Real-time push alerts',
      'Track record deep-dive',
      'Priority support',
    ],
  },
  {
    id: 'vip-yearly',
    name: 'VIP Annual',
    currency: 'NGN',
    amount: 39999,
    interval: 'yearly',
    features: [
      'Everything in VIP monthly',
      'Save ₦19,989 vs monthly',
      '2 free premium tips/month',
      'Early access to new AI models',
      'Monthly strategy calls',
    ],
  },
];

// ─── Bookmakers ───────────────────────────────────────────────────────────────

export const mockBookmakers: Bookmaker[] = [
  {
    id: 'bet9ja',
    name: 'Bet9ja',
    logoUrl: '/bookmakers/bet9ja.svg',
    affiliateUrl: 'https://bet9ja.com',
  },
  {
    id: 'sportybet',
    name: 'SportyBet',
    logoUrl: '/bookmakers/sportybet.svg',
    affiliateUrl: 'https://sportybet.com',
  },
  {
    id: '1xbet',
    name: '1xBet',
    logoUrl: '/bookmakers/1xbet.svg',
    affiliateUrl: 'https://1xbet.com',
  },
  {
    id: 'betway',
    name: 'Betway',
    logoUrl: '/bookmakers/betway.svg',
    affiliateUrl: 'https://betway.com',
  },
  {
    id: 'nairabet',
    name: 'NairaBet',
    logoUrl: '/bookmakers/nairabet.svg',
    affiliateUrl: 'https://nairabet.com',
  },
];

// ─── Track Record ─────────────────────────────────────────────────────────────

export const mockTrackRecord: TrackRecordEntry[] = [
  { id: 'tr-001', date: hoursAgo(26), fixture: 'Enyimba FC vs Kwara United', pick: 'Home Win', market: '1X2', odds: 1.85, result: 'won', tipster: 'ChukwuAnalyst', roiDelta: 0.85 },
  { id: 'tr-002', date: hoursAgo(50), fixture: 'Man City vs Burnley', pick: 'Over 2.5', market: 'OU2.5', odds: 1.55, result: 'won', tipster: 'AlphaModel v3', roiDelta: 0.55 },
  { id: 'tr-003', date: hoursAgo(74), fixture: 'Real Madrid vs Sevilla', pick: 'Home Win', market: '1X2', odds: 1.45, result: 'lost', tipster: 'SigmaAI Pro', roiDelta: -1.00 },
  { id: 'tr-004', date: hoursAgo(50), fixture: 'Rivers United vs Heartland FC', pick: 'Over 2.5', market: 'OU2.5', odds: 2.05, result: 'won', tipster: 'AlphaModel v3', roiDelta: 1.05 },
  { id: 'tr-005', date: hoursAgo(98), fixture: 'Tottenham vs Newcastle', pick: 'Away Win', market: '1X2', odds: 2.75, result: 'won', tipster: 'AmakaStats', roiDelta: 1.75 },
  { id: 'tr-006', date: hoursAgo(122), fixture: 'Atletico Madrid vs Dortmund', pick: 'Home Win', market: '1X2', odds: 1.80, result: 'lost', tipster: 'SigmaAI Pro', roiDelta: -1.00 },
  { id: 'tr-007', date: hoursAgo(146), fixture: 'Liverpool vs Everton', pick: 'Home Win', market: '1X2', odds: 1.60, result: 'won', tipster: 'AlphaModel v3', roiDelta: 0.60 },
  { id: 'tr-008', date: hoursAgo(170), fixture: 'Barcelona vs Real Betis', pick: 'Yes', market: 'BTTS', odds: 1.78, result: 'won', tipster: 'SigmaAI Pro', roiDelta: 0.78 },
  { id: 'tr-009', date: hoursAgo(194), fixture: 'Shooting Stars vs Remo Stars', pick: 'Over 2.5', market: 'OU2.5', odds: 2.20, result: 'lost', tipster: 'TundeFC', roiDelta: -1.00 },
  { id: 'tr-010', date: hoursAgo(218), fixture: 'Inter Milan vs Napoli', pick: 'Home Win', market: '1X2', odds: 1.90, result: 'won', tipster: 'AlphaModel v3', roiDelta: 0.90 },
  { id: 'tr-011', date: hoursAgo(242), fixture: 'Arsenal vs Wolves', pick: 'Over 2.5', market: 'OU2.5', odds: 1.75, result: 'won', tipster: 'ChukwuAnalyst', roiDelta: 0.75 },
  { id: 'tr-012', date: hoursAgo(266), fixture: 'Man Utd vs Brighton', pick: 'Draw', market: '1X2', odds: 3.40, result: 'won', tipster: 'TundeFC', roiDelta: 2.40 },
  { id: 'tr-013', date: hoursAgo(290), fixture: 'Bayern Munich vs Leverkusen', pick: 'Home Win', market: '1X2', odds: 1.55, result: 'lost', tipster: 'AlphaModel v3', roiDelta: -1.00 },
  { id: 'tr-014', date: hoursAgo(314), fixture: 'Kano Pillars vs Sunshine Stars', pick: 'Home Win', market: '1X2', odds: 1.70, result: 'won', tipster: 'AmakaStats', roiDelta: 0.70 },
  { id: 'tr-015', date: hoursAgo(338), fixture: 'PSG vs Lyon', pick: 'Yes', market: 'BTTS', odds: 1.65, result: 'won', tipster: 'SigmaAI Pro', roiDelta: 0.65 },
];

// ─── Overall Stats ────────────────────────────────────────────────────────────

export const mockOverallStats: OverallStats = {
  winRate: 67.8,
  totalPicks: 748,
  settledPicks: 663,
  roiUnits: 94.3,
  streak: 4,
  streakType: 'won',
  last30WinRate: 71.4,
  avgOdds: 1.94,
};

// ─── ROI Chart Data ───────────────────────────────────────────────────────────

export const mockRoiData: RoiDataPoint[] = [
  { date: '2024-01-01', roi: 0, cumulative: 0 },
  { date: '2024-01-08', roi: 3.2, cumulative: 3.2 },
  { date: '2024-01-15', roi: -1.0, cumulative: 2.2 },
  { date: '2024-01-22', roi: 4.5, cumulative: 6.7 },
  { date: '2024-02-01', roi: 2.1, cumulative: 8.8 },
  { date: '2024-02-08', roi: -1.0, cumulative: 7.8 },
  { date: '2024-02-15', roi: 5.8, cumulative: 13.6 },
  { date: '2024-02-22', roi: 1.6, cumulative: 15.2 },
  { date: '2024-03-01', roi: 3.9, cumulative: 19.1 },
  { date: '2024-03-08', roi: -1.0, cumulative: 18.1 },
  { date: '2024-03-15', roi: 6.2, cumulative: 24.3 },
  { date: '2024-03-22', roi: 2.8, cumulative: 27.1 },
  { date: '2024-04-01', roi: 4.1, cumulative: 31.2 },
  { date: '2024-04-08', roi: -1.0, cumulative: 30.2 },
  { date: '2024-04-15', roi: 5.5, cumulative: 35.7 },
  { date: '2024-04-22', roi: 3.3, cumulative: 39.0 },
  { date: '2024-05-01', roi: 7.1, cumulative: 46.1 },
  { date: '2024-05-08', roi: -1.0, cumulative: 45.1 },
  { date: '2024-05-15', roi: 4.6, cumulative: 49.7 },
  { date: '2024-05-22', roi: 2.9, cumulative: 52.6 },
  { date: '2024-06-01', roi: 8.3, cumulative: 60.9 },
  { date: '2024-06-08', roi: -1.0, cumulative: 59.9 },
  { date: '2024-06-15', roi: 5.1, cumulative: 65.0 },
  { date: '2024-06-22', roi: 6.7, cumulative: 71.7 },
  { date: '2024-07-01', roi: -1.0, cumulative: 70.7 },
  { date: '2024-07-08', roi: 4.2, cumulative: 74.9 },
  { date: '2024-07-15', roi: 3.8, cumulative: 78.7 },
  { date: '2024-07-22', roi: 6.1, cumulative: 84.8 },
  { date: '2024-08-01', roi: -1.0, cumulative: 83.8 },
  { date: '2024-08-08', roi: 5.4, cumulative: 89.2 },
  { date: '2024-08-15', roi: 3.1, cumulative: 92.3 },
  { date: '2024-08-22', roi: 2.0, cumulative: 94.3 },
];
