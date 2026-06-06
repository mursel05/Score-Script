export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function EssayCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      </div>
      <Skeleton className="h-3 w-full mt-4" />
      <Skeleton className="h-3 w-5/6 mt-2" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5">
      <Skeleton className="h-3 w-1/2 mb-3" />
      <Skeleton className="h-7 w-1/3" />
    </div>
  );
}
