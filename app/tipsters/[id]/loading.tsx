import { Skeleton, StatTileSkeleton, CardSkeleton } from '@/components/Skeleton';

export default function TipsterProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      <Skeleton className="h-4 w-32 rounded-lg" />
      <div className="rounded-2xl p-6 border border-white/8" style={{ background: '#111317' }}>
        <div className="flex items-center gap-5">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <StatTileSkeleton key={i} />)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
