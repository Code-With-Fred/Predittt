'use client';

import { useEffect, useState } from 'react';
import type { Fixture } from '@/lib/types';

interface Props {
  fixture: Fixture;
  compact?: boolean;
}

function formatCountdown(kickoffAt: string): string {
  const diff = new Date(kickoffAt).getTime() - Date.now();
  if (diff <= 0) return 'Kicked off';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h`;
  }
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function TeamLogo({ name, logoUrl, size }: { name: string; logoUrl: string; size: number }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="rounded-full bg-white/8 border border-white/10 flex items-center justify-center font-bold text-white/70 shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.28 }}
      >
        {name.slice(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={name}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      className="rounded-full shrink-0 object-contain bg-white/5 border border-white/10 p-1"
      style={{ width: size, height: size }}
    />
  );
}

export default function FixtureHeader({ fixture, compact = false }: Props) {
  const [countdown, setCountdown] = useState(formatCountdown(fixture.kickoffAt));

  useEffect(() => {
    if (fixture.status !== 'scheduled') return;
    const id = setInterval(() => setCountdown(formatCountdown(fixture.kickoffAt)), 30_000);
    return () => clearInterval(id);
  }, [fixture.kickoffAt, fixture.status]);

  const logoSize = compact ? 40 : 56;
  const kickoff = new Date(fixture.kickoffAt);
  const timeStr = kickoff.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  const dateStr = kickoff.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* League badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {fixture.league}
        </span>
        {fixture.status === 'live' && (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 animate-pulse uppercase tracking-wider">
            Live
          </span>
        )}
      </div>

      {/* Teams row */}
      <div className="flex items-center gap-4 w-full justify-center">
        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <TeamLogo name={fixture.home.name} logoUrl={fixture.home.logoUrl} size={logoSize} />
          <span className={`font-bold text-center truncate w-full ${compact ? 'text-sm' : 'text-base'}`}>
            {fixture.home.name}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          {fixture.status === 'finished' ? (
            <div className="tabular text-2xl font-black tracking-tight">
              {fixture.homeScore ?? 0}
              <span className="text-muted-foreground mx-1">—</span>
              {fixture.awayScore ?? 0}
            </div>
          ) : fixture.status === 'live' ? (
            <div className="tabular text-2xl font-black tracking-tight text-red-400">
              {fixture.homeScore ?? 0}
              <span className="text-muted-foreground mx-1">:</span>
              {fixture.awayScore ?? 0}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="tabular text-xl font-black text-white/90">{timeStr}</span>
              <span className="text-xs text-muted-foreground">{dateStr}</span>
              <span className="text-xs font-medium mt-0.5 tabular" style={{ color: '#AAFF00' }}>{countdown}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <TeamLogo name={fixture.away.name} logoUrl={fixture.away.logoUrl} size={logoSize} />
          <span className={`font-bold text-center truncate w-full ${compact ? 'text-sm' : 'text-base'}`}>
            {fixture.away.name}
          </span>
        </div>
      </div>
    </div>
  );
}
