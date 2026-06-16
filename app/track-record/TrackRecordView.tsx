'use client';

import { useState, useMemo } from 'react';
import { Trophy, X, Clock, TrendingUp, ArrowUpDown } from 'lucide-react';
import type { OverallStats, RoiDataPoint, TrackRecordEntry, Tipster } from '@/lib/types';
import StatTile from '@/components/StatTile';
import WinRateChart from '@/components/WinRateChart';

type SortKey = 'date' | 'odds' | 'result';
type SortDir = 'asc' | 'desc';

interface Props {
  stats: OverallStats;
  roiData: RoiDataPoint[];
  records: TrackRecordEntry[];
  tipsters: Tipster[];
}

const MARKETS = ['All', '1X2', 'OU2.5', 'BTTS', 'Correct Score'];

const resultBadge = {
  won: { label: 'Won', color: '#AAFF00', bg: 'rgba(170,255,0,0.12)', icon: Trophy },
  lost: { label: 'Lost', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: X },
  pending: { label: 'Pending', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', icon: Clock },
  void: { label: 'Void', color: '#6B7280', bg: 'rgba(107,114,128,0.12)', icon: Clock },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function TrackRecordView({ stats, roiData, records, tipsters }: Props) {
  const [tipsterFilter, setTipsterFilter] = useState('All');
  const [marketFilter, setMarketFilter] = useState('All');
  const [resultFilter, setResultFilter] = useState('All');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' });

  const tipsterNames = ['All', ...tipsters.map((t) => t.displayName)];

  const filtered = useMemo(() => {
    let r = [...records];
    if (tipsterFilter !== 'All') r = r.filter((e) => e.tipster === tipsterFilter);
    if (marketFilter !== 'All') r = r.filter((e) => e.market === marketFilter);
    if (resultFilter !== 'All') r = r.filter((e) => e.result === resultFilter.toLowerCase());

    r.sort((a, b) => {
      let diff = 0;
      if (sort.key === 'date') diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sort.key === 'odds') diff = a.odds - b.odds;
      else if (sort.key === 'result') diff = a.result.localeCompare(b.result);
      return sort.dir === 'asc' ? diff : -diff;
    });

    return r;
  }, [records, tipsterFilter, marketFilter, resultFilter, sort]);

  const wonCount = filtered.filter((r) => r.result === 'won').length;
  const settledCount = filtered.filter((r) => r.result === 'won' || r.result === 'lost').length;
  const filteredWinRate = settledCount > 0 ? ((wonCount / settledCount) * 100).toFixed(1) : '-';

  function toggleSort(key: SortKey) {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: '#AAFF00' }} />
          <h1 className="text-2xl font-black tracking-tight">Track Record</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Every settled pick, publicly auditable. No cherry-picking.
        </p>
      </div>

      {/* Overall stat tiles */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Overall Win Rate" value={`${stats.winRate}%`} highlight delta={stats.last30WinRate - stats.winRate} deltaLabel="% vs last 30d" />
        <StatTile label="Total ROI" value={`+${stats.roiUnits}`} suffix="u" highlight />
        <StatTile label="Settled Picks" value={stats.settledPicks} />
        <StatTile label="Avg Odds" value={stats.avgOdds.toFixed(2)} suffix="x" />
      </section>

      {/* Chart */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cumulative ROI (units)</h2>
        <div
          className="rounded-2xl p-5"
          style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <WinRateChart data={roiData} />
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Filter history</h2>
        <div className="flex flex-wrap gap-2">
          {/* Tipster */}
          <select
            value={tipsterFilter}
            onChange={(e) => setTipsterFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#AAFF00]/50"
            style={{ background: '#111317' }}
          >
            {tipsterNames.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Market */}
          <select
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#AAFF00]/50"
            style={{ background: '#111317' }}
          >
            {MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Result */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#AAFF00]/50"
            style={{ background: '#111317' }}
          >
            {['All', 'Won', 'Lost', 'Void'].map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Reset */}
          {(tipsterFilter !== 'All' || marketFilter !== 'All' || resultFilter !== 'All') && (
            <button
              onClick={() => { setTipsterFilter('All'); setMarketFilter('All'); setResultFilter('All'); }}
              className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-white border border-white/8 hover:border-white/20 transition-all"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Filtered stats */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} pick{filtered.length !== 1 ? 's' : ''} — win rate:{' '}
          <span className="tabular font-bold" style={{ color: '#AAFF00' }}>{filteredWinRate}%</span>
        </p>
      </section>

      {/* History table */}
      <section>
        <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#111317' }}>
          {/* Table header */}
          <div
            className="hidden md:grid gap-0 border-b border-white/8 text-xs font-bold text-muted-foreground uppercase tracking-wider"
            style={{ gridTemplateColumns: '1fr 1.5fr 1fr 0.7fr 0.7fr 0.8fr 0.8fr' }}
          >
            <button className="flex items-center gap-1 p-4 hover:text-white transition-colors text-left" onClick={() => toggleSort('date')}>
              Date <ArrowUpDown className="w-3 h-3" />
            </button>
            <div className="p-4">Fixture</div>
            <div className="p-4">Pick</div>
            <div className="p-4">Market</div>
            <button className="flex items-center gap-1 p-4 hover:text-white transition-colors" onClick={() => toggleSort('odds')}>
              Odds <ArrowUpDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 p-4 hover:text-white transition-colors" onClick={() => toggleSort('result')}>
              Result <ArrowUpDown className="w-3 h-3" />
            </button>
            <div className="p-4">ROI</div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No picks match your filters.
            </div>
          ) : (
            filtered.map((entry, i) => {
              const badge = resultBadge[entry.result] ?? resultBadge.pending;
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={entry.id}
                  className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/2"
                  style={i % 2 === 0 ? {} : { background: 'rgba(255,255,255,0.01)' }}
                >
                  {/* Mobile layout */}
                  <div className="md:hidden p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        <BadgeIcon className="w-2.5 h-2.5" />
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white/90 truncate">{entry.fixture}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{entry.market}</span>
                      <span>·</span>
                      <span className="font-bold text-white">{entry.pick}</span>
                      <span>·</span>
                      <span className="tabular font-bold">{entry.odds.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{entry.tipster}</span>
                      <span className="tabular font-bold" style={{ color: entry.roiDelta > 0 ? '#AAFF00' : '#EF4444' }}>
                        {entry.roiDelta > 0 ? '+' : ''}{entry.roiDelta.toFixed(2)}u
                      </span>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div
                    className="hidden md:grid gap-0 text-sm"
                    style={{ gridTemplateColumns: '1fr 1.5fr 1fr 0.7fr 0.7fr 0.8fr 0.8fr' }}
                  >
                    <div className="p-4 text-muted-foreground">{formatDate(entry.date)}</div>
                    <div className="p-4 text-white/90 truncate">{entry.fixture}</div>
                    <div className="p-4 font-medium truncate">{entry.pick}</div>
                    <div className="p-4 text-muted-foreground">{entry.market}</div>
                    <div className="p-4 tabular font-bold">{entry.odds.toFixed(2)}</div>
                    <div className="p-4">
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        <BadgeIcon className="w-2.5 h-2.5" />
                        {badge.label}
                      </span>
                    </div>
                    <div
                      className="p-4 tabular font-bold"
                      style={{ color: entry.roiDelta > 0 ? '#AAFF00' : '#EF4444' }}
                    >
                      {entry.roiDelta > 0 ? '+' : ''}{entry.roiDelta.toFixed(2)}u
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
