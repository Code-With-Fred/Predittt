import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-sm">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(170,255,0,0.08)', border: '1px solid rgba(170,255,0,0.15)' }}
        >
          <span className="tabular text-3xl font-black" style={{ color: '#AAFF00' }}>404</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This page doesn&apos;t exist or may have been moved.
            Head back to today&apos;s picks.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#AAFF00', color: '#0A0B0D' }}
          >
            <TrendingUp className="w-4 h-4" />
            Today&apos;s Picks
          </Link>
          <Link
            href="/track-record"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            Track Record
          </Link>
        </div>
      </div>
    </div>
  );
}
