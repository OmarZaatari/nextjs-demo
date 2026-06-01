import { Suspense } from 'react';
import { getAllBooks, getAllAuthors } from '@/lib/data';
import BooksClient from '@/components/BooksClient';

export default function BooksPage() {
  const books = getAllBooks();
  const authors = getAllAuthors();

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-zinc-600 dark:text-zinc-400">Loading books...</p>
        </div>
      }
    >
      <BooksClient initialBooks={books} authors={authors} />
    </Suspense>
  );
}
