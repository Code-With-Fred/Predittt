import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import type { Prediction } from '@/lib/types';

export type GatedPrediction = Prediction & { isUnlocked: boolean };

// Resolves whether the current session user can see the real pick/reasoning
// for a prediction. Returns the prediction with sensitive fields scrubbed if
// the user does not have access. MUST be called server-side only.
export async function resolvePredictionForUser(prediction: Prediction): Promise<GatedPrediction> {
  if (prediction.visibility === 'free') {
    return { ...prediction, isUnlocked: true };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return scrub(prediction);
  }

  // VIP check: user has an active subscription
  if (prediction.visibility === 'vip') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_vip')
      .eq('id', user.id)
      .single();

    if (profile?.is_vip) {
      return { ...prediction, isUnlocked: true };
    }
    return scrub(prediction);
  }

  // Premium check: user has purchased this specific tip
  if (prediction.visibility === 'premium') {
    const svc = createServiceClient();
    const { data: purchase } = await svc
      .from('tip_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('prediction_id', prediction.id)
      .eq('status', 'success')
      .maybeSingle();

    if (purchase) {
      return { ...prediction, isUnlocked: true };
    }
    return scrub(prediction);
  }

  return scrub(prediction);
}

// Batch version — resolves a list in parallel
export async function resolvePredictionsForUser(predictions: Prediction[]): Promise<GatedPrediction[]> {
  return Promise.all(predictions.map(resolvePredictionForUser));
}

// Replaces sensitive fields with empty strings so they cannot leak
function scrub(prediction: Prediction): GatedPrediction {
  return {
    ...prediction,
    pick: '',
    reasoning: '',
    isUnlocked: false,
  };
}
