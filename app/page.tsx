import type { Metadata } from 'next';
import { getTodaysPredictions, getOverallStats, getBookmakers } from '@/lib/api';
import HomeFeed from './HomeFeed';

export const metadata: Metadata = {
  title: "Today's Football Predictions",
  description: "Today's free and VIP football predictions from AI models and expert tipsters. Verified 71.4% win rate — check the track record.",
};

export default async function HomePage() {
  const [predictions, stats, bookmakers] = await Promise.all([
    getTodaysPredictions(),
    getOverallStats(),
    getBookmakers(),
  ]);

  return <HomeFeed predictions={predictions} stats={stats} bookmakers={bookmakers} />;
}
