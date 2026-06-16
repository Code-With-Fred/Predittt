'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-sm">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertTriangle className="w-9 h-9 text-red-400" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black">Something went wrong</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred. Try again or head back to the home feed.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#AAFF00', color: '#0A0B0D' }}
          >
            Try again
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
