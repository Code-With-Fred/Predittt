import { Skeleton, CardSkeleton } from '@/components/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Profile hero */}
      <div className="rounded-2xl p-6 border border-white/8" style={{ background: '#111317' }}>
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>
      </div>
      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
