import { Check, Star } from 'lucide-react';
import type { Plan } from '@/lib/types';

interface Props {
  plan: Plan;
  currency?: 'NGN' | 'USD';
}

const usdRates: Record<string, number> = {
  'free': 0,
  'vip-monthly': 3.12,
  'vip-yearly': 24.99,
};

export default function PlanCard({ plan, currency = 'NGN' }: Props) {
  const isFree = plan.amount === 0;
  const isPopular = plan.popular;

  const displayAmount = currency === 'USD' ? (usdRates[plan.id] ?? plan.amount) : plan.amount;
  const symbol = currency === 'NGN' ? '₦' : '$';
  const formatted = currency === 'NGN'
    ? displayAmount.toLocaleString()
    : displayAmount.toFixed(2);

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: isPopular ? 'linear-gradient(160deg, #1A1D22 0%, #0F1115 100%)' : '#111317',
        border: isPopular ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isPopular ? '0 0 40px rgba(245,166,35,0.08)' : 'none',
      }}
    >
      {/* Popular badge */}
      {isPopular && (
        <div
          className="absolute top-0 left-0 right-0 py-1.5 text-center text-[11px] font-black uppercase tracking-widest"
          style={{ background: '#F5A623', color: '#0A0B0D' }}
        >
          <Star className="inline w-3 h-3 mr-1 -mt-0.5" />
          Most Popular
        </div>
      )}

      <div className={`flex flex-col gap-5 p-6 ${isPopular ? 'pt-10' : ''} flex-1`}>
        {/* Name + interval */}
        <div>
          <h3
            className="font-black text-lg"
            style={{ color: isPopular ? '#F5A623' : isFree ? '#94A3B8' : 'white' }}
          >
            {plan.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{plan.interval}</p>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1">
          {isFree ? (
            <span className="tabular text-4xl font-black text-white">Free</span>
          ) : (
            <>
              <span className="tabular text-xl font-bold text-muted-foreground self-start mt-1">{symbol}</span>
              <span className="tabular text-4xl font-black" style={{ color: isPopular ? '#F5A623' : 'white' }}>
                {formatted}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
            </>
          )}
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2.5 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: isPopular ? '#F5A623' : '#AAFF00' }}
              />
              <span className="text-white/80">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
          style={
            isPopular
              ? { background: '#F5A623', color: '#0A0B0D' }
              : isFree
              ? { background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }
              : { background: 'rgba(170,255,0,0.12)', color: '#AAFF00', border: '1px solid rgba(170,255,0,0.25)' }
          }
        >
          {isFree ? 'Get Started Free' : isPopular ? 'Go VIP Now' : 'Get Annual VIP'}
        </button>
      </div>
    </div>
  );
}
