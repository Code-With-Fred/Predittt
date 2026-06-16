import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function ComplianceFooter() {
  return (
    <footer className="border-t border-white/8 mt-16 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Compliance strip */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-red-500/15 text-red-400 border border-red-500/20">
            18+
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/8">
            Gamble responsibly
          </span>
          <a
            href="https://www.gamblingtherapy.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/8 hover:text-white transition-colors"
          >
            Get help →
          </a>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-white/3 border border-white/6 rounded-xl p-4">
          <Shield className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-white/60">Predictions are statistical analysis, not guaranteed outcomes.</strong>{' '}
            All picks are based on data models and expert opinion. Past performance does not indicate future results.
            Betting involves risk — only wager what you can afford to lose. This platform does not provide financial
            advice. Must be 18 or older to participate.
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/responsible-gambling" className="hover:text-white transition-colors">Responsible Gambling</Link>
          <a href="mailto:hello@predicta.ng" className="hover:text-white transition-colors">Contact</a>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Predicta.ng — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
