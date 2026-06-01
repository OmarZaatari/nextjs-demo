import { Skeleton, TableSkeleton } from "@/components/skeletons/Skeleton";

export default function PublishersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading publishers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}
