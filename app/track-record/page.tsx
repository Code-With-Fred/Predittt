import type { Metadata } from 'next';
import { getOverallStats, getRoiChartData, getTrackRecord, getTipsters } from '@/lib/api';
import TrackRecordView from './TrackRecordView';

export const metadata: Metadata = {
  title: 'Track Record',
  description: 'Every settled pick, publicly auditable. View our verified win rate, ROI, and full prediction history — no cherry-picking.',
};

export default async function TrackRecordPage() {
  const [stats, roiData, records, tipsters] = await Promise.all([
    getOverallStats(),
    getRoiChartData(),
    getTrackRecord(),
    getTipsters(),
  ]);

  return <TrackRecordView stats={stats} roiData={roiData} records={records} tipsters={tipsters} />;
}
