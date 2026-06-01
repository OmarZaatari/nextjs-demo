import { DetailPageSkeleton } from "@/components/skeletons/Skeleton";

export default function AuthorDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading author details">
      <DetailPageSkeleton />
    </div>
  );
}
