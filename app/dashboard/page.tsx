import { getMockUser, getTodaysPredictions } from '@/lib/api';
import DashboardView from './DashboardView';

export default async function DashboardPage() {
  const [user, predictions] = await Promise.all([
    getMockUser(),
    getTodaysPredictions(),
  ]);

  return <DashboardView user={user} predictions={predictions} />;
}
