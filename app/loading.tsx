import { CardSkeleton, StatTileSkeleton, Skeleton } from '@/components/Skeleton';

export default function HomeLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Hero skeleton */}
      <div className="rounded-2xl p-6 border border-white/8" style={{ background: '#111317' }}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-3 w-56" />
            <div className="flex gap-3 mt-1">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-32 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:w-72">
            {Array.from({ length: 4 }).map((_, i) => <StatTileSkeleton key={i} />)}
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
