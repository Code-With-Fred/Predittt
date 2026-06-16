import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase/service';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-paystack-signature') ?? '';

  const expectedSig = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as PaystackEvent;
  const svc = createServiceClient();

  // Extract a stable idempotency key from whichever field is present
  const eventId = (event.data as Record<string, unknown>)['reference'] as string | undefined
    ?? (event.data as Record<string, unknown>)['id'] as string | undefined
    ?? event.id;

  // Idempotency: skip if already processed
  const { data: existing } = await svc
    .from('payment_events')
    .select('id')
    .eq('provider', 'paystack')
    .eq('event_id', eventId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  // Record event for idempotency before processing
  await svc.from('payment_events').insert({
    provider: 'paystack' as const,
    event_id: eventId,
    event_type: event.event,
    payload: event as unknown as import('@/lib/database.types').Json,
  });

  switch (event.event) {
    case 'charge.success':
      await handleChargeSuccess(svc, event.data as ChargeData);
      break;
    case 'subscription.create':
      await handleSubscriptionCreate(svc, event.data as SubscriptionData);
      break;
    case 'subscription.disable':
    case 'invoice.payment_failed':
      await handleSubscriptionDisable(svc, event.data as SubscriptionData);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function handleChargeSuccess(svc: ReturnType<typeof createServiceClient>, data: ChargeData) {
  const meta = data.metadata ?? {};

  if (meta['type'] === 'tip_purchase') {
    await svc
      .from('tip_purchases')
      .update({ status: 'success' as const, updated_at: new Date().toISOString() })
      .eq('paystack_reference', data.reference);
    return;
  }

  const userId = meta['user_id'];
  const planId = meta['plan_id'];

  if (meta['type'] === 'subscription' && userId && planId) {
    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await svc.from('subscriptions').upsert(
      {
        user_id: userId,
        plan_id: planId,
        status: 'active' as const,
        paystack_customer_code: data.customer?.customer_code ?? null,
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,plan_id' },
    );
  }
}

async function handleSubscriptionCreate(svc: ReturnType<typeof createServiceClient>, data: SubscriptionData) {
  const userId = (data.metadata ?? {})['user_id'];
  const planCode = data.plan?.plan_code;
  if (!userId || !planCode) return;

  const { data: plan } = await svc
    .from('subscription_plans')
    .select('id')
    .eq('paystack_plan_code', planCode)
    .maybeSingle();

  if (!plan) return;

  const periodEnd = data.next_payment_date
    ? new Date(data.next_payment_date)
    : (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; })();

  await svc.from('subscriptions').upsert(
    {
      user_id: userId,
      plan_id: plan.id,
      status: 'active' as const,
      paystack_subscription_code: data.subscription_code ?? null,
      paystack_customer_code: data.customer?.customer_code ?? null,
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,plan_id' },
  );
}

async function handleSubscriptionDisable(svc: ReturnType<typeof createServiceClient>, data: SubscriptionData) {
  if (!data.subscription_code) return;
  await svc
    .from('subscriptions')
    .update({ status: 'cancelled' as const, updated_at: new Date().toISOString() })
    .eq('paystack_subscription_code', data.subscription_code);
}

// ─── Paystack event types (minimal) ───────────────────────────────────────────

interface PaystackEvent {
  event: string;
  id: string;
  data: ChargeData | SubscriptionData;
}

interface ChargeData {
  reference: string;
  metadata?: Record<string, string>;
  customer?: { customer_code: string };
}

interface SubscriptionData {
  subscription_code?: string;
  next_payment_date?: string;
  metadata?: Record<string, string>;
  plan?: { plan_code: string };
  customer?: { customer_code: string };
  id?: string;
}
