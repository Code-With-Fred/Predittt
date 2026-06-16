'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart3, Users, LayoutDashboard, Menu, X, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Picks', icon: TrendingUp },
  { href: '/track-record', label: 'Track Record', icon: BarChart3 },
  { href: '/tipsters', label: 'Tipsters', icon: Users },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/8"
      style={{ background: 'rgba(10,11,13,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs"
            style={{ background: '#AAFF00', color: '#0A0B0D' }}
          >
            P
          </div>
          <span className="font-black text-base tracking-tight">
            Predic<span style={{ color: '#AAFF00' }}>ta</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'text-white bg-white/10'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/vip"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all hover:opacity-90 active:scale-95 gold-glow"
            style={{ background: '#F5A623', color: '#0A0B0D' }}
          >
            ⚡ Go VIP
          </Link>
          <Link
            href="/login"
            className="hidden sm:flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
          >
            Sign in
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/8 px-4 py-3 flex flex-col gap-1" style={{ background: '#0A0B0D' }}>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active ? 'text-white bg-white/10' : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/8 mt-1">
            <Link
              href="/vip"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: '#F5A623', color: '#0A0B0D' }}
            >
              ⚡ Go VIP — ₦4,999/mo
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-white border border-white/8 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
