'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { RoiDataPoint } from '@/lib/types';

interface Props {
  data: RoiDataPoint[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  const color = value >= 0 ? '#AAFF00' : '#EF4444';
  return (
    <div className="bg-[#1A1D22] border border-white/10 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-muted-foreground text-xs mb-1">{label}</p>
      <p className="tabular font-bold" style={{ color }}>
        {value >= 0 ? '+' : ''}{value.toFixed(1)} units
      </p>
    </div>
  );
}

export default function WinRateChart({ data }: Props) {
  // Only render recharts client-side — avoids the SSR width/height warning
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
  }));

  const lastValue = data[data.length - 1]?.cumulative ?? 0;
  const isPositive = lastValue >= 0;
  const color = isPositive ? '#AAFF00' : '#EF4444';

  return (
    <div ref={containerRef} className="w-full h-64">
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}u`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke={color}
              strokeWidth={2}
              fill="url(#roiGradient)"
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: 'transparent' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        // Placeholder with same dimensions shown during SSR/hydration
        <div className="w-full h-full rounded-xl animate-pulse bg-white/4" />
      )}
    </div>
  );
}
