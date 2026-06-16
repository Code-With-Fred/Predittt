import { Skeleton, TableRowSkeleton } from '@/components/Skeleton';

export default function TipstersLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-3 w-72" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-14 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#111317' }}>
        {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}
      </div>
    </div>
  );
}
