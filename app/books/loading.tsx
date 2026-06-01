import { Skeleton, BookGridSkeleton } from "@/components/skeletons/Skeleton";

export default function BooksLoading() {
  return (
    <div aria-busy="true" aria-label="Loading books">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-12 w-full mb-8" />
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-40 mb-4" />
      </div>
      <BookGridSkeleton count={6} />
    </div>
  );
}
