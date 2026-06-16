'use client';

import Link from 'next/link';
import { Trophy, X, Clock, Cpu, User, Zap } from 'lucide-react';
import type { Prediction } from '@/lib/types';
import ConfidenceMeter from './ConfidenceMeter';
import LockedOverlay from './LockedOverlay';
import BookmarkButton from './BookmarkButton';

interface Props {
  prediction: Prediction;
  isUnlocked?: boolean;
}

const statusConfig = {
  won: { label: 'Won', icon: Trophy, color: '#AAFF00', bg: 'rgba(170,255,0,0.12)' },
  lost: { label: 'Lost', icon: X, color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  pending: { label: 'Pending', icon: Clock, color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
  void: { label: 'Void', icon: X, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

const sourceConfig = {
  ai: { label: 'AI', icon: Cpu, color: '#AAFF00' },
  manual: { label: 'Expert', icon: User, color: '#94A3B8' },
  hybrid: { label: 'Hybrid', icon: Zap, color: '#F5A623' },
};

function formatKickoff(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  if (diff > 0 && diff < 3_600_000 * 24) {
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
  return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
}

export default function PredictionCard({ prediction, isUnlocked = false }: Props) {
  const { fixture, tipster, status, source, market, pick, odds, confidence, visibility, price } = prediction;
  const locked = (visibility === 'vip' || visibility === 'premium') && !isUnlocked;
  const stat = statusConfig[status];
  const src = sourceConfig[source];
  const StatIcon = stat.icon;
  const SrcIcon = src.icon;

  const cardBorder =
    status === 'won'
      ? 'border-[#AAFF00]/20'
      : status === 'lost'
      ? 'border-red-500/20'
      : 'border-white/8';

  return (
    <Link href={`/predictions/${prediction.id}`}>
      <div
        className={`relative bg-[#111317] border ${cardBorder} rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-[#1A1D22] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 overflow-hidden`}
      >
        {/* Status glow line */}
        {status === 'won' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: '#AAFF00' }} />
        )}
        {status === 'lost' && (
          <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-red-500" />
        )}

        {/* Header: League + Status + Source */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-muted-foreground font-medium truncate">{fixture.league}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <BookmarkButton id={prediction.id} />
            {/* Source badge */}
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: `${src.color}18`, color: src.color }}
            >
              <SrcIcon className="w-2.5 h-2.5" />
              {src.label}
            </span>
            {/* Status badge */}
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
              style={{ background: stat.bg, color: stat.color }}
            >
              <StatIcon className="w-2.5 h-2.5" />
              {stat.label}
            </span>
          </div>
        </div>

        {/* Fixture */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-bold text-sm leading-tight truncate">
              {fixture.home.name}
            </span>
            <span className="font-bold text-sm leading-tight truncate text-muted-foreground">
              vs {fixture.away.name}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            {fixture.status === 'finished' ? (
              <span className="tabular font-black text-base">
                {fixture.homeScore}–{fixture.awayScore}
              </span>
            ) : (
              <span className="tabular text-xs text-muted-foreground">
                {formatKickoff(fixture.kickoffAt)}
              </span>
            )}
            {fixture.status === 'live' && (
              <span className="text-[10px] text-red-400 font-bold animate-pulse">LIVE</span>
            )}
          </div>
        </div>

        {/* Pick area — locked or revealed */}
        <div className="relative">
          {locked ? (
            <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{market}</span>
                <span className="text-sm font-bold prediction-blur select-none">
                  {'█████████'}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Odds</span>
                <span className="tabular text-base font-black prediction-blur">{'█.██'}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{market}</span>
                <span className="text-sm font-bold text-white">{pick}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Odds</span>
                <span
                  className="tabular text-base font-black"
                  style={{ color: status === 'won' ? '#AAFF00' : status === 'lost' ? '#EF4444' : 'white' }}
                >
                  {odds.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Locked overlay badges */}
          {visibility === 'vip' && locked && (
            <div className="absolute -top-2 -right-2">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ background: '#F5A623', color: '#0A0B0D' }}
              >
                VIP
              </span>
            </div>
          )}
          {visibility === 'premium' && locked && (
            <div className="absolute -top-2 -right-2">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest lime-glow"
                style={{ background: '#AAFF00', color: '#0A0B0D' }}
              >
                ₦{price?.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Confidence meter */}
        {!locked && (
          <ConfidenceMeter value={confidence} size="sm" />
        )}

        {/* Tipster */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ background: tipster.isAi ? 'rgba(170,255,0,0.15)' : 'rgba(148,163,184,0.15)', color: tipster.isAi ? '#AAFF00' : '#94A3B8' }}
          >
            {tipster.isAi ? <Cpu className="w-3 h-3" /> : tipster.displayName.slice(0, 1)}
          </div>
          <span className="text-xs text-muted-foreground">{tipster.displayName}</span>
          <span className="ml-auto tabular text-xs font-bold" style={{ color: '#AAFF00' }}>
            {tipster.winRate}%
          </span>
        </div>

        {/* Locked CTA strip */}
        {locked && (
          <div
            className="rounded-lg p-2.5 flex items-center justify-center gap-2 text-xs font-bold"
            style={{
              background: visibility === 'vip' ? 'rgba(245,166,35,0.10)' : 'rgba(170,255,0,0.08)',
              color: visibility === 'vip' ? '#F5A623' : '#AAFF00',
              border: `1px solid ${visibility === 'vip' ? 'rgba(245,166,35,0.2)' : 'rgba(170,255,0,0.15)'}`,
            }}
          >
            {visibility === 'vip' ? '🔒 Unlock with VIP — ₦4,999/mo' : `🔒 Unlock for ₦${price?.toLocaleString()}`}
          </div>
        )}
      </div>
    </Link>
  );
}
