import { BookDetailSkeleton } from "@/components/skeletons/Skeleton";

export default function BookDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading book details">
      <BookDetailSkeleton />
    </div>
  );
}
