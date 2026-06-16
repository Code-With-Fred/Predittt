import { Skeleton, CardSkeleton } from '@/components/Skeleton';

export default function PredictionDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <Skeleton className="h-4 w-24 rounded-lg" />

      {/* Fixture header */}
      <div className="rounded-2xl p-6 border border-white/8 flex flex-col items-center gap-4" style={{ background: '#111317' }}>
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center gap-8 w-full justify-center">
          <div className="flex flex-col items-center gap-2 flex-1">
            <Skeleton className="w-14 h-14 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-16" />
          <div className="flex flex-col items-center gap-2 flex-1">
            <Skeleton className="w-14 h-14 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Pick card */}
      <div className="rounded-2xl p-5 border border-white/8 flex flex-col gap-5" style={{ background: '#111317' }}>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>

      {/* Related */}
      <div className="grid gap-4 sm:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
