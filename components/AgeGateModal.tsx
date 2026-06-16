'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

const STORAGE_KEY = 'predicta_age_confirmed';

export default function AgeGateModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let confirmed = false;
    try {
      confirmed = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // localStorage blocked — use in-memory (confirmed stays false, showing modal once per session)
    }
    if (!confirmed) setVisible(true);
  }, []);

  function confirm() {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // in-memory dismissal — modal will reappear next session but not current one
    }
    setVisible(false);
  }

  function decline() {
    window.location.href = 'https://www.google.com';
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.92)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6 text-center"
        style={{ background: '#111317', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Logo / icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(170,255,0,0.08)' }}
        >
          <Shield className="w-8 h-8" style={{ color: '#AAFF00' }} />
        </div>

        <div className="flex flex-col gap-2">
          <span
            className="text-3xl font-black"
            style={{ color: '#AAFF00' }}
          >
            18+
          </span>
          <h2 className="text-xl font-bold text-white">Age Verification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This platform provides sports predictions and contains links to betting services.
            You must be <strong className="text-white">18 years or older</strong> to continue.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={confirm}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 lime-glow"
            style={{ background: '#AAFF00', color: '#0A0B0D' }}
          >
            I am 18 or older — Continue
          </button>
          <button
            onClick={decline}
            className="w-full py-2.5 rounded-xl font-medium text-sm text-muted-foreground hover:text-white transition-colors"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            I am under 18 — Exit
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          By continuing, you confirm you are of legal gambling age in your jurisdiction
          and agree to our Terms of Service and Responsible Gambling policy.
        </p>
      </div>
    </div>
  );
}
