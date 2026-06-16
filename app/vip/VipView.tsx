'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown, ChevronUp, TrendingUp, Shield, Zap, Cpu } from 'lucide-react';
import PlanCard from '@/components/PlanCard';
import type { Plan } from '@/lib/types';

const FEATURES = [
  { label: 'Free picks (up to 3/day)', free: true, vip: true },
  { label: 'Full pick reasoning & analysis', free: false, vip: true },
  { label: 'Unlimited VIP picks daily', free: false, vip: true },
  { label: 'AI model predictions (AlphaModel v3, SigmaAI Pro)', free: false, vip: true },
  { label: 'Real-time push alerts', free: false, vip: true },
  { label: 'Track record deep-dive & filtering', free: 'Basic', vip: true },
  { label: 'Priority support', free: false, vip: true },
  { label: 'Bookmaker odds comparison', free: true, vip: true },
];

const FAQS = [
  {
    q: 'How does the win rate track record work?',
    a: 'Every prediction we publish is recorded with its result — won, lost, or void. Win rate is calculated from all settled picks over the period shown. All data is auditable on the Track Record page.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept card payments, bank transfers, and mobile money (MTN MoMo, Airtel Money). All payments are processed securely via Paystack.',
  },
  {
    q: 'Can I cancel my VIP subscription?',
    a: 'Yes — cancel any time from your dashboard. You retain access until the end of your billing period. No hidden fees.',
  },
  {
    q: 'What is the difference between VIP and Premium picks?',
    a: 'VIP picks are included in your monthly subscription. Premium picks are high-value, high-effort tips priced individually (pay-per-tip). VIP subscribers get 2 free premium tips/month on the annual plan.',
  },
  {
    q: 'Are these predictions guaranteed?',
    a: 'No. All picks are statistical analysis based on data models and expert opinion. Past performance does not guarantee future results. Please gamble responsibly.',
  },
];

const TESTIMONIALS = [
  { name: 'Emeka O.', location: 'Lagos', text: 'Been using for 3 months. AlphaModel picks are scary accurate, especially the UCL overs.', avatar: 'E' },
  { name: 'Fatima K.', location: 'Abuja', text: 'The track record page convinced me. I love that I can verify every single pick — no cap.', avatar: 'F' },
  { name: 'Chidi N.', location: 'Port Harcourt', text: '65% win rate across 40+ picks since going VIP. Worth every naira.', avatar: 'C' },
];

interface Props {
  plans: Plan[];
}

export default function VipView({ plans }: Props) {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-14">
      {/* Hero */}
      <section className="text-center flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.25)' }}>
          <Zap className="w-3 h-3" />
          VIP Membership
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Data-driven picks,<br />
          <span style={{ color: '#AAFF00' }}>verified results.</span>
        </h1>
        <p className="text-muted-foreground max-w-lg text-base leading-relaxed">
          Join thousands of Nigerian bettors using our AI-powered predictions and expert analysis.
          Every pick is tracked. Every result is public.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-6 mt-2">
          {[
            { icon: TrendingUp, value: '71.4%', label: 'Win rate (last 30d)' },
            { icon: Cpu, value: '2 AI models', label: 'Proprietary models' },
            { icon: Shield, value: '663+', label: 'Verified picks' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Icon className="w-4 h-4" style={{ color: '#AAFF00' }} />
              <span className="tabular font-bold text-white">{value}</span>
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <a href="#plans" className="mt-2 px-6 py-3 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 gold-glow" style={{ background: '#F5A623', color: '#0A0B0D' }}>
          See Plans ↓
        </a>
      </section>

      {/* Plans */}
      <section id="plans" className="flex flex-col gap-6">
        {/* Currency toggle */}
        <div className="flex items-center justify-center gap-1 p-1 rounded-xl w-fit mx-auto" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {(['NGN', 'USD'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={
                currency === c
                  ? { background: '#AAFF00', color: '#0A0B0D' }
                  : { color: '#64748B' }
              }
            >
              {c === 'NGN' ? '₦ NGN' : '$ USD'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currency={currency} />
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-black text-center">What&apos;s included</h2>
        <div className="rounded-2xl overflow-hidden border border-white/8">
          {/* Header */}
          <div className="grid grid-cols-3 gap-0 border-b border-white/8" style={{ background: '#111317' }}>
            <div className="p-4 text-sm font-bold text-muted-foreground">Feature</div>
            <div className="p-4 text-sm font-bold text-center text-muted-foreground border-l border-white/8">Free</div>
            <div className="p-4 text-sm font-bold text-center border-l border-white/8" style={{ color: '#F5A623' }}>VIP</div>
          </div>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="grid grid-cols-3 gap-0 border-b border-white/5 last:border-0"
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
            >
              <div className="p-4 text-sm text-white/80">{f.label}</div>
              <div className="p-4 flex items-center justify-center border-l border-white/8">
                {f.free === true ? (
                  <Check className="w-4 h-4" style={{ color: '#AAFF00' }} />
                ) : f.free === false ? (
                  <X className="w-4 h-4 text-muted-foreground/40" />
                ) : (
                  <span className="text-xs text-muted-foreground">{f.free}</span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-white/8">
                {f.vip === true ? (
                  <Check className="w-4 h-4" style={{ color: '#F5A623' }} />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground/40" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-black text-center">What members say</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-sm text-white/80 leading-relaxed">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-2.5 mt-auto pt-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: 'rgba(170,255,0,0.12)', color: '#AAFF00' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-black text-center">Frequently asked questions</h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-white/8 cursor-pointer"
              style={{ background: '#111317' }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm font-medium text-white/90">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="rounded-2xl p-8 text-center flex flex-col items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #111317, #0F1115)', border: '1px solid rgba(245,166,35,0.2)' }}
      >
        <h2 className="text-2xl font-black">Ready to bet smarter?</h2>
        <p className="text-muted-foreground max-w-md">
          Join VIP today. Cancel any time. Every pick tracked publicly so you can judge our record before you spend a naira.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/track-record" className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-white border border-white/10 hover:border-white/20 transition-all">
            Check Track Record First
          </Link>
          <a href="#plans" className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 gold-glow" style={{ background: '#F5A623', color: '#0A0B0D' }}>
            ⚡ Go VIP Now
          </a>
        </div>
      </section>
    </div>
  );
}
