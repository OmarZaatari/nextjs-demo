'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { Book, Author } from '@/lib/data';
import {
  BOOKS_PAGE_SIZE,
  buildPageHref,
  paginate,
  parsePageParam,
} from '@/lib/pagination';

interface BooksClientProps {
  initialBooks: Book[];
  authors: Author[];
}

export default function BooksClient({ initialBooks, authors }: BooksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedGenre = searchParams.get('genre') ?? 'all';
  const currentPage = parsePageParam(searchParams.get('page'));

  const navigateWithParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      router.replace(query ? `/books?${query}` : '/books');
    },
    [router],
  );

  const handleGenreSelect = useCallback(
    (genre: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (genre === 'all') {
        params.delete('genre');
      } else {
        params.set('genre', genre);
      }
      params.delete('page');
      navigateWithParams(params);
    },
    [searchParams, navigateWithParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      router.replace(buildPageHref('/books', page, searchParams));
    },
    [router, searchParams],
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const genres = useMemo(() => {
    const genreSet = new Set(initialBooks.map((book) => book.genre));
    return ['all', ...Array.from(genreSet)];
  }, [initialBooks]);

  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authors
          .find((a) => a.id === book.authorId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === 'all' || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [initialBooks, searchQuery, selectedGenre, authors]);

  const {
    items: paginatedBooks,
    page: safePage,
    totalPages,
    totalItems,
  } = useMemo(
    () => paginate(filteredBooks, currentPage, BOOKS_PAGE_SIZE),
    [filteredBooks, currentPage],
  );

  useEffect(() => {
    if (currentPage !== safePage) {
      router.replace(buildPageHref('/books', safePage, searchParams));
    }
  }, [currentPage, safePage, router, searchParams]);

  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * BOOKS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * BOOKS_PAGE_SIZE, totalItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        All Books
      </h1>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by title or author..."
      />

      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {genres.map((genreOption) => (
            <button
              key={genreOption}
              type="button"
              onClick={() => handleGenreSelect(genreOption)}
              aria-pressed={selectedGenre === genreOption}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedGenre === genreOption
                  ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {genreOption === 'all' ? 'All Genres' : genreOption}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {totalItems === 0
          ? 'No books found'
          : `Showing ${rangeStart}–${rangeEnd} of ${totalItems} ${totalItems === 1 ? 'book' : 'books'}`}
      </p>

      {totalItems === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBooks.map((book) => {
              const author = authors.find((a) => a.id === book.authorId);

              return (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-80 bg-zinc-200 dark:bg-zinc-800">
                    <Image
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      {book.title}
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      by {author?.name}
                    </p>
                    <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500">
                      <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                        {book.genre}
                      </span>
                      <span>{book.publishedYear}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ariaLabel="Books pagination"
          />
        </>
      )}
    </div>
  );
}
