import type { Bookmaker } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface Props {
  bookmakers: Bookmaker[];
}

const colors: Record<string, { bg: string; text: string }> = {
  bet9ja: { bg: '#006400', text: '#ffffff' },
  sportybet: { bg: '#1a5276', text: '#ffffff' },
  '1xbet': { bg: '#1A1A2E', text: '#00C7FF' },
  betway: { bg: '#00A651', text: '#ffffff' },
  nairabet: { bg: '#8B0000', text: '#FFD700' },
};

export default function BookmakerStrip({ bookmakers }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Bet with confidence at</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">Sponsored</span>
      </div>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {bookmakers.map((bm) => {
          const style = colors[bm.id] ?? { bg: '#1A1D22', text: '#fff' };
          return (
            <a
              key={bm.id}
              href={bm.affiliateUrl}
              target="_blank"
              rel="noopener sponsored"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold shrink-0 transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: style.bg, color: style.text }}
            >
              {bm.name}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
