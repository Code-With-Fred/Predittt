import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AgeGateModal from '@/components/AgeGateModal';
import ComplianceFooter from '@/components/ComplianceFooter';
import MobileBottomNav from '@/components/MobileBottomNav';
import { BookmarkProvider } from '@/lib/BookmarkContext';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Predicta.ng — Data-Driven Football Predictions',
    template: '%s | Predicta.ng',
  },
  description:
    'Verified win-rate football tips and analysis. Free picks daily. Join VIP for unlimited access to AI-powered predictions and expert analysis.',
  keywords: ['football predictions', 'football tips', 'betting tips', 'NPFL predictions', 'EPL predictions', 'Nigeria betting'],
  authors: [{ name: 'Predicta.ng' }],
  creator: 'Predicta.ng',
  metadataBase: new URL('https://predicta.ng'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://predicta.ng',
    siteName: 'Predicta.ng',
    title: 'Predicta.ng — Data-Driven Football Predictions',
    description: 'Verified win-rate football tips and analysis. Free picks daily. AI-powered predictions and expert analysis.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Predicta.ng' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predicta.ng — Data-Driven Football Predictions',
    description: 'Verified win-rate football tips and analysis.',
    images: ['/og-image.png'],
    creator: '@predictang',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="antialiased min-h-screen" style={{ background: '#0A0B0D' }}>
        <BookmarkProvider>
          <AgeGateModal />
          <Navbar />
          <main className="min-h-[calc(100vh-56px)] pb-20 md:pb-0">{children}</main>
          <ComplianceFooter />
          <MobileBottomNav />
        </BookmarkProvider>
      </body>
    </html>
  );
}
