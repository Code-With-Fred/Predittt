import Link from 'next/link';
import { Lock } from 'lucide-react';

interface Props {
  type: 'vip' | 'premium';
  price?: number;
}

export default function LockedOverlay({ type, price }: Props) {
  const isVip = type === 'vip';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10 backdrop-blur-[2px]"
      style={{ background: isVip ? 'rgba(10,11,13,0.82)' : 'rgba(10,11,13,0.82)' }}
    >
      <div
        className="flex flex-col items-center gap-3 px-4 text-center"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: isVip ? 'rgba(245,166,35,0.15)' : 'rgba(170,255,0,0.12)' }}
        >
          <Lock
            className="w-5 h-5"
            style={{ color: isVip ? '#F5A623' : '#AAFF00' }}
          />
        </div>

        {isVip ? (
          <>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#F5A623' }}>
                VIP Pick
              </span>
              <p className="text-sm text-white/80 mt-1">Unlock all VIP picks</p>
            </div>
            <Link
              href="/vip"
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#F5A623', color: '#0A0B0D' }}
            >
              Go VIP
            </Link>
          </>
        ) : (
          <>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#AAFF00' }}>
                Premium Pick
              </span>
              <p className="text-sm text-white/80 mt-1">Pay-per-tip unlock</p>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95 lime-glow"
              style={{ background: '#AAFF00', color: '#0A0B0D' }}
            >
              Unlock for ₦{price?.toLocaleString()}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
