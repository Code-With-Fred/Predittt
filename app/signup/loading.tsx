import { Skeleton } from '@/components/Skeleton';

export default function SignupLoading() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="rounded-2xl p-6 flex flex-col gap-5 border border-white/8" style={{ background: '#111317' }}>
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <Skeleton className="h-3 w-5" />
            <div className="flex-1 h-px bg-white/8" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
