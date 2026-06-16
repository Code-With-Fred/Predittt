import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTipsterById, getTipsterPredictions } from '@/lib/api';
import TipsterProfile from './TipsterProfile';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tipster = await getTipsterById(id);
  if (!tipster) return { title: 'Tipster Not Found' };
  return {
    title: `${tipster.displayName} — Tipster Profile | Predicta.ng`,
    description: `${tipster.displayName} has a ${tipster.winRate}% win rate across ${tipster.settled} settled picks. View full record and predictions.`,
  };
}

export default async function TipsterPage({ params }: Props) {
  const { id } = await params;
  const [tipster, predictions] = await Promise.all([
    getTipsterById(id),
    getTipsterPredictions(id),
  ]);
  if (!tipster) notFound();
  return <TipsterProfile tipster={tipster} predictions={predictions} />;
}
