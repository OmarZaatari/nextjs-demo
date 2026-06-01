import { Skeleton, AuthorGridSkeleton } from "@/components/skeletons/Skeleton";

export default function AuthorsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading authors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-4 w-56 mb-6" />
      </div>
      <AuthorGridSkeleton count={4} />
    </div>
  );
}
