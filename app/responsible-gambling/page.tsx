import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import ContentPage, { Section } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Responsible Gambling',
  description: 'Predicta.ng is committed to responsible gambling. Find resources, self-assessment tools, and help lines here.',
};

const warningSigns = [
  'Betting with money needed for rent, food, or bills',
  'Chasing losses to try to win back money',
  'Hiding your betting from family or friends',
  'Feeling anxious, irritable, or restless when not betting',
  'Borrowing money or selling possessions to fund gambling',
  'Spending more time betting than intended',
  'Neglecting work, school, or family responsibilities',
];

const helplines = [
  { name: 'Gambling Therapy (Global)', url: 'https://www.gamblingtherapy.org', desc: 'Free online support and counselling' },
  { name: 'Gamblers Anonymous Nigeria', url: 'https://www.gamblersanonymous.org', desc: 'Peer support groups' },
  { name: 'NCADD Nigeria', url: 'https://www.ncadd.org', desc: 'Addiction counselling and referrals' },
];

export default function ResponsibleGamblingPage() {
  return (
    <ContentPage title="Responsible Gambling" subtitle="Betting should be entertainment, not a financial strategy.">

      {/* 18+ banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <span className="text-2xl font-black text-red-400 shrink-0">18+</span>
        <p className="text-sm text-red-300 leading-relaxed">
          You must be 18 years or older to use this platform and to participate in gambling activities. If you are under 18, please leave this site.
        </p>
      </div>

      <Section title="Our commitment">
        <p>Predicta.ng publishes statistical analysis to inform betting decisions. We are committed to promoting safe, responsible gambling behaviour. We do not use language that suggests certainty or guarantees of winning.</p>
        <p>Predictions are data-driven opinions — not financial advice, and not a reliable income source. Please treat any money spent on betting as entertainment spending, not investment.</p>
      </Section>

      {/* Warning signs */}
      <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <h3 className="text-sm font-bold text-white">Warning signs of problem gambling</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {warningSigns.map((sign) => (
            <li key={sign} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
              {sign}
            </li>
          ))}
        </ul>
      </div>

      <Section title="Tools to stay in control">
        <p><strong className="text-white/80">Set a budget.</strong> Before you bet, decide the maximum amount you can afford to lose — not win. Treat it like buying a ticket to a sporting event.</p>
        <p><strong className="text-white/80">Take breaks.</strong> Step away from betting regularly. A daily limit on time spent reviewing picks is as important as a monetary limit.</p>
        <p><strong className="text-white/80">Self-exclude.</strong> All licensed Nigerian bookmakers offer self-exclusion tools. Contact them directly to set deposit limits, cooling-off periods, or full exclusions.</p>
        <p><strong className="text-white/80">Never chase losses.</strong> Losing streaks are normal. Increasing stakes to recover losses is one of the most common paths to serious problems.</p>
      </Section>

      {/* Helplines */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" style={{ color: '#AAFF00' }} />
          <h3 className="text-sm font-bold text-white">Get help now</h3>
        </div>
        {helplines.map((h) => (
          <a
            key={h.name}
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-xl transition-all hover:border-white/15"
            style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Shield className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#AAFF00' }} />
            <div>
              <p className="text-sm font-bold text-white">{h.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground border-t border-white/8 pt-4">
        If you are concerned about your gambling or that of someone you know, please reach out to one of the organisations above. Help is available and confidential.
      </p>
    </ContentPage>
  );
}
