import { StatTileSkeleton, TableRowSkeleton, Skeleton } from '@/components/Skeleton';

export default function TrackRecordLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-3 w-64" />
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <StatTileSkeleton key={i} />)}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5 border border-white/8" style={{ background: '#111317' }}>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-lg" />)}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#111317' }}>
        {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)}
      </div>
    </div>
  );
}
