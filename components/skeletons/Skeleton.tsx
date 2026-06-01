interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`}
      aria-hidden="true"
    />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-10 w-64 mb-8" />
    </div>
  );
}

export function BookGridSkeleton({
  count = 6,
  embedded = false,
}: {
  count?: number;
  embedded?: boolean;
}) {
  const grid = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden"
        >
          <Skeleton className="h-80 w-full rounded-none" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (embedded) {
    return grid;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {grid}
    </div>
  );
}

export function AuthorGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6"
          >
            <div className="flex gap-4 mb-4">
              <Skeleton className="h-20 w-20 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-full sm:w-64" />
      </div>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <Skeleton className="h-14 w-full rounded-none" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-none border-t border-zinc-200 dark:border-zinc-800" />
        ))}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-5 w-40 mb-6" />
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mt-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-48 w-48 rounded-full shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
      <Skeleton className="h-8 w-64 mt-12 mb-6" />
      <BookGridSkeleton count={3} />
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-5 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        <Skeleton className="h-96 md:h-[500px] w-full rounded-lg" />
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}
