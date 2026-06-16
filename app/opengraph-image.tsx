import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Predicta.ng — Data-Driven Football Predictions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0B0D',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 600, height: 600, borderRadius: '50%',
          background: 'rgba(170,255,0,0.06)', filter: 'blur(120px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(245,166,35,0.05)', filter: 'blur(120px)',
        }} />

        {/* Logo mark */}
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: '#AAFF00', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: 24,
        }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: '#0A0B0D' }}>P</span>
        </div>

        {/* Site name */}
        <div style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginBottom: 8, letterSpacing: -1 }}>
          Predic<span style={{ color: '#AAFF00' }}>ta</span>.ng
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 22, color: '#64748B', marginBottom: 48, fontWeight: 500 }}>
          Data-Driven Football Predictions
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 48, marginBottom: 32 }}>
          {[
            { value: '71.4%', label: 'Win Rate (30d)' },
            { value: '+94u', label: 'ROI (12 months)' },
            { value: '748', label: 'Picks Published' },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#AAFF00', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
              <span style={{ fontSize: 14, color: '#64748B', fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
          borderRadius: 999, background: 'rgba(170,255,0,0.1)',
          border: '1px solid rgba(170,255,0,0.2)',
        }}>
          <span style={{ fontSize: 13, color: '#AAFF00', fontWeight: 700 }}>Fully verifiable track record · predicta.ng</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
