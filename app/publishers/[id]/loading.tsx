import { DetailPageSkeleton } from "@/components/skeletons/Skeleton";

export default function PublisherDetailLoading() {
  return (
    <div aria-busy="true" aria-label="Loading publisher details">
      <DetailPageSkeleton />
    </div>
  );
}
