import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({ className, rounded = 'md' }: Props) {
  const r = { sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl', full: 'rounded-full' }[rounded];
  return (
    <div
      className={cn('animate-pulse bg-white/6', r, className)}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/8 p-4 flex flex-col gap-3" style={{ background: '#111317' }}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16" rounded="full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="rounded-lg p-3 flex justify-between" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="h-5 w-10" />
        </div>
      </div>
      <Skeleton className="h-1.5 w-full" rounded="full" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-5 w-5" rounded="full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10 ml-auto" />
      </div>
    </div>
  );
}

export function StatTileSkeleton() {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-2 border border-white/8" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <Skeleton className="h-2.5 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-5 w-14" rounded="full" />
    </div>
  );
}
