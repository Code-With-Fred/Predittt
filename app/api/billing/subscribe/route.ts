import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { rateLimit } from '@/lib/rate-limit';

const BodySchema = z.object({
  planId: z.string().uuid(),
});

export async function POST(request: Request) {
  // Rate-limit: 5 attempts per minute per IP
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`subscribe:${ip}`, 5, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 });
  }

  const { planId } = parsed.data;
  const svc = createServiceClient();

  const { data: plan } = await svc
    .from('subscription_plans')
    .select('id, name, amount_kobo, currency, paystack_plan_code')
    .eq('id', planId)
    .single();

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const { data: profile } = await svc
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single();

  const reference = `sub_${user.id.replace(/-/g, '')}_${Date.now()}`;

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: profile?.email ?? user.email,
      amount: plan.amount_kobo,
      currency: plan.currency,
      reference,
      plan: plan.paystack_plan_code ?? undefined,
      metadata: {
        user_id: user.id,
        plan_id: plan.id,
        type: 'subscription',
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=1`,
    }),
  });

  const paystackData = await paystackRes.json();
  if (!paystackData.status) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 502 });
  }

  return NextResponse.json({ authorizationUrl: paystackData.data.authorization_url, reference });
}
