import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: predictionId } = await params;

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`unlock:${ip}`, 10, 60)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const svc = createServiceClient();

  const { data: prediction, error: predErr } = await svc
    .from('predictions')
    .select('id, visibility, price_ngn, status')
    .eq('id', predictionId)
    .single();

  if (predErr || !prediction) {
    return NextResponse.json({ error: 'Prediction not found' }, { status: 404 });
  }

  if (prediction.visibility !== 'premium') {
    return NextResponse.json({ error: 'This pick does not require a purchase' }, { status: 400 });
  }

  // Idempotent: already purchased
  const { data: existing } = await svc
    .from('tip_purchases')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('prediction_id', predictionId)
    .maybeSingle();

  if (existing?.status === 'success') {
    return NextResponse.json({ alreadyUnlocked: true });
  }

  const { data: profile } = await svc
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single();

  const reference = `tip_${user.id.replace(/-/g, '')}_${predictionId.replace(/-/g, '')}_${Date.now()}`;
  const amountKobo = (prediction.price_ngn ?? 0) * 100;

  // Create a pending purchase record before redirecting to Paystack
  await svc.from('tip_purchases').upsert({
    user_id: user.id,
    prediction_id: predictionId,
    amount_kobo: amountKobo,
    currency: 'NGN',
    status: 'pending',
    paystack_reference: reference,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,prediction_id' });

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: profile?.email ?? user.email,
      amount: amountKobo,
      currency: 'NGN',
      reference,
      metadata: {
        user_id: user.id,
        prediction_id: predictionId,
        type: 'tip_purchase',
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/predictions/${predictionId}?unlocked=1`,
    }),
  });

  const paystackData = await paystackRes.json();
  if (!paystackData.status) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 502 });
  }

  return NextResponse.json({ authorizationUrl: paystackData.data.authorization_url, reference });
}
