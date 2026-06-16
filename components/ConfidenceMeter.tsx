'use client';

interface Props {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getColor(v: number) {
  if (v >= 75) return '#AAFF00';
  if (v >= 55) return '#F5A623';
  return '#EF4444';
}

function getLabel(v: number) {
  if (v >= 80) return 'Very High';
  if (v >= 65) return 'High';
  if (v >= 50) return 'Moderate';
  return 'Low';
}

export default function ConfidenceMeter({ value, size = 'md', showLabel = true }: Props) {
  const color = getColor(value);
  const label = getLabel(value);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="w-full">
      {showLabel && (
        <div className={`flex items-center justify-between mb-1.5 ${textSize}`}>
          <span className="text-muted-foreground font-medium">Confidence</span>
          <span className="tabular font-bold" style={{ color }}>
            {value}% — {label}
          </span>
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
      </div>
    </div>
  );
}
