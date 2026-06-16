import type { Metadata } from 'next';
import { getPlans } from '@/lib/api';
import VipView from './VipView';

export const metadata: Metadata = {
  title: 'VIP Membership',
  description: 'Unlock unlimited VIP picks, full AI model predictions, and expert analysis from ₦4,999/month. Cancel any time.',
};

export default async function VipPage() {
  const plans = await getPlans();
  return <VipView plans={plans} />;
}
