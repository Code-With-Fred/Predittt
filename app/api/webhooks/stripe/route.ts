import { NextResponse } from 'next/server';

// Stripe webhooks are scaffolded for international payments.
// Wire up when STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are configured
// and the `stripe` npm package is installed.
export async function POST() {
  return NextResponse.json(
    { error: 'Stripe integration not yet enabled' },
    { status: 501 },
  );
}
