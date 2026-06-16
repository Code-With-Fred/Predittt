import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export default function ContentPage({ title, subtitle, backHref = '/', backLabel = 'Home', children }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      <Link href={backHref} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="prose prose-invert prose-sm max-w-none flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-bold text-white/90">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
