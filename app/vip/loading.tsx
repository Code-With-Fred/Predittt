import { Skeleton } from '@/components/Skeleton';

export default function VipLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
      {/* Hero */}
      <div className="text-center flex flex-col items-center gap-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="flex gap-2 mt-1">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-5 flex flex-col gap-4 border border-white/8" style={{ background: '#111317' }}>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="h-3 w-full" />)}
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
