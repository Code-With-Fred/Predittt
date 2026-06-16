export type PredictionSource = 'ai' | 'manual' | 'hybrid';
export type PredictionStatus = 'pending' | 'won' | 'lost' | 'void';
export type Visibility = 'free' | 'vip' | 'premium';

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Fixture {
  id: string;
  league: string;
  leagueLogo: string;
  home: Team;
  away: Team;
  kickoffAt: string; // ISO
  status: 'scheduled' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
}

export interface Tipster {
  id: string;
  displayName: string;
  isAi: boolean;
  avatarUrl: string;
  winRate: number;   // 0-100
  roiUnits: number;  // profit on 1-unit flat stakes
  settled: number;   // number of settled tips
}

export interface Prediction {
  id: string;
  fixture: Fixture;
  tipster: Tipster;
  source: PredictionSource;
  market: string;        // '1X2','OU2.5','BTTS','Correct Score'
  pick: string;          // 'Home Win','Over 2.5','Yes','2-1'
  odds: number;
  confidence: number;    // 0-100
  reasoning: string;     // shown only when unlocked
  visibility: Visibility;
  price: number;         // NGN, for premium picks
  status: PredictionStatus;
  publishedAt: string;   // ISO
}

export interface Plan {
  id: string;
  name: string;
  currency: 'NGN' | 'USD';
  amount: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export interface Bookmaker {
  id: string;
  name: string;
  logoUrl: string;
  affiliateUrl: string;
}

export interface TrackRecordEntry {
  id: string;
  date: string;
  fixture: string;
  pick: string;
  market: string;
  odds: number;
  result: PredictionStatus;
  tipster: string;
  roiDelta: number;
}

export interface OverallStats {
  winRate: number;
  totalPicks: number;
  settledPicks: number;
  roiUnits: number;
  streak: number;
  streakType: 'won' | 'lost';
  last30WinRate: number;
  avgOdds: number;
}

export interface RoiDataPoint {
  date: string;
  roi: number;
  cumulative: number;
}
