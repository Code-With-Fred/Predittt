import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string | number;
  delta?: number;       // positive = up, negative = down
  deltaLabel?: string;
  highlight?: boolean;  // use lime accent
  gold?: boolean;       // use gold accent
  suffix?: string;
  prefix?: string;
}

export default function StatTile({ label, value, delta, deltaLabel, highlight, gold, suffix, prefix }: Props) {
  const accentColor = gold ? '#F5A623' : highlight ? '#AAFF00' : 'white';
  const bgAccent = gold ? 'rgba(245,166,35,0.06)' : highlight ? 'rgba(170,255,0,0.06)' : 'transparent';
  const borderAccent = gold ? 'rgba(245,166,35,0.15)' : highlight ? 'rgba(170,255,0,0.12)' : 'rgba(255,255,255,0.08)';

  const deltaPositive = delta !== undefined && delta > 0;
  const deltaNeutral = delta === undefined || delta === 0;

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: bgAccent, border: `1px solid ${borderAccent}` }}
    >
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
      <div className="flex items-end gap-1">
        {prefix && <span className="text-base text-muted-foreground mb-0.5">{prefix}</span>}
        <span
          className={cn('tabular font-black leading-none', 'text-3xl')}
          style={{ color: accentColor }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {suffix && <span className="text-sm text-muted-foreground mb-0.5">{suffix}</span>}
      </div>

      {delta !== undefined && (
        <div className="flex items-center gap-1">
          {deltaNeutral ? (
            <Minus className="w-3 h-3 text-muted-foreground" />
          ) : deltaPositive ? (
            <TrendingUp className="w-3 h-3 text-[#AAFF00]" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <span
            className="text-xs tabular font-medium"
            style={{ color: deltaNeutral ? '#64748B' : deltaPositive ? '#AAFF00' : '#EF4444' }}
          >
            {deltaPositive ? '+' : ''}{delta}{deltaLabel || ''}
          </span>
        </div>
      )}
    </div>
  );
}
