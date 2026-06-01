import { Suspense } from "react";
import PublishersClient from "@/components/PublishersClient";
import {
  getAllPublishers,
  getBooksByPublisherId,
} from "@/lib/data";

export default function PublishersPage() {
  const publishers = getAllPublishers().map((publisher) => ({
    id: publisher.id,
    name: publisher.name,
    country: publisher.country,
    foundedYear: publisher.foundedYear,
    bookCount: getBooksByPublisherId(publisher.id).length,
  }));

  const countries = Array.from(
    new Set(publishers.map((publisher) => publisher.country)),
  ).sort();

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-zinc-600 dark:text-zinc-400">Loading publishers...</p>
        </div>
      }
    >
      <PublishersClient publishers={publishers} countries={countries} />
    </Suspense>
  );
}
