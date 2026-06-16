import { notFound } from 'next/navigation';
import { getPredictionById, getRelatedPredictions, getBookmakers } from '@/lib/api';
import PredictionDetail from './PredictionDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PredictionPage({ params }: Props) {
  const { id } = await params;
  const [prediction, related, bookmakers] = await Promise.all([
    getPredictionById(id),
    getRelatedPredictions(id),
    getBookmakers(),
  ]);

  if (!prediction) notFound();

  return <PredictionDetail prediction={prediction} related={related} bookmakers={bookmakers} />;
}
