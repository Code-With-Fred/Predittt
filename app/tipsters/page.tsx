import type { Metadata } from 'next';
import { getTipsters } from '@/lib/api';
import TipstersView from './TipstersView';

export const metadata: Metadata = {
  title: 'Tipster Leaderboard',
  description: 'AI models and expert analysts ranked by verified win rate and ROI. See who is performing and follow their picks.',
};

export default async function TipstersPage() {
  const tipsters = await getTipsters();
  return <TipstersView tipsters={tipsters} />;
}
