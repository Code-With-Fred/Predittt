import { NextResponse } from 'next/server';
import { settleFinishedFixtures } from '@/lib/sportsdata';

// Vercel cron: every 2 hours
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await settleFinishedFixtures();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[settle] error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
