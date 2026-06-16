import type { Metadata } from 'next';
import Link from 'next/link';
import { Cpu, BarChart3, Shield, Users } from 'lucide-react';
import ContentPage, { Section } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Predicta.ng — who we are, how our AI models work, and why we publish a fully verifiable track record.',
};

const values = [
  { icon: BarChart3, title: 'Radical transparency', desc: 'Every pick we publish is recorded. Every result is public. No deleting losses. Our track record page shows the full picture — you can verify every single call.' },
  { icon: Cpu, title: 'AI-first analysis', desc: 'Our proprietary models process match data, xG metrics, injury reports, and market signals to surface edges that are hard to spot manually. Human experts add the situational layer.' },
  { icon: Shield, title: 'Responsible by design', desc: 'We never use language like "guaranteed" or "sure win". Predictions are analysis, not promises. We actively promote responsible gambling and link to support resources.' },
  { icon: Users, title: 'Built for Nigeria', desc: 'Prices in Naira, NPFL coverage, integration with Nigerian bookmakers. We know the market and the fans — this is not a generic global product.' },
];

export default function AboutPage() {
  return (
    <ContentPage title="About Predicta.ng" subtitle="Data-driven football analysis, built for the Nigerian market.">
      <Section title="Who we are">
        <p>Predicta.ng is a football predictions platform built to give Nigerian bettors an edge through data — not guesswork. We combine proprietary AI models with experienced human analysts to produce picks across EPL, La Liga, UEFA Champions League, NPFL, and more.</p>
        <p>We launched because we believed the market deserved something better: a platform where every prediction is tracked, every result is public, and the analysis is honest about uncertainty.</p>
      </Section>

      <div className="grid sm:grid-cols-2 gap-4 my-2">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 shrink-0" style={{ color: '#AAFF00' }} />
              <h3 className="text-sm font-bold text-white">{title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <Section title="How our models work">
        <p>AlphaModel v3 and SigmaAI Pro are trained on thousands of historical matches, incorporating over 40 features per fixture: expected goals, possession metrics, recent form, head-to-head records, squad news, and bookmaker line movements.</p>
        <p>Neither model is exposed to live prices until after the prediction is published — this prevents overfitting to market consensus. Model confidence scores represent the system&apos;s probability estimate, not a recommendation to stake any particular amount.</p>
      </Section>

      <Section title="Contact">
        <p>For partnerships, press enquiries, or responsible gambling support: <a href="mailto:hello@predicta.ng" className="text-[#AAFF00] hover:underline">hello@predicta.ng</a></p>
      </Section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/track-record" className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:opacity-90" style={{ background: '#AAFF00', color: '#0A0B0D' }}>
          View Track Record
        </Link>
        <Link href="/vip" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-white border border-white/10 hover:border-white/20 transition-all">
          Go VIP
        </Link>
      </div>
    </ContentPage>
  );
}
