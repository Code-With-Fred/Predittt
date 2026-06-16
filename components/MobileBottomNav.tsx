'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart3, Users, LayoutDashboard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Picks', icon: TrendingUp },
  { href: '/track-record', label: 'Record', icon: BarChart3 },
  { href: '/vip', label: 'VIP', icon: Zap, vip: true },
  { href: '/tipsters', label: 'Tipsters', icon: Users },
  { href: '/dashboard', label: 'Account', icon: LayoutDashboard },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 pb-safe"
      style={{ background: 'rgba(10,11,13,0.97)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, vip }) => {
          const active = pathname === href;

          if (vip) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 px-3 py-1 -mt-5"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  style={{ background: '#F5A623', boxShadow: '0 0 20px rgba(245,166,35,0.4)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#0A0B0D' }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#F5A623' }}>
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all active:scale-95',
                active ? 'text-white' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {active && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#AAFF00' }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-medium"
                style={active ? { color: '#AAFF00' } : {}}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
