import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getAllAuthors, getBooksByAuthorId } from '@/lib/data';
import Pagination from '@/components/Pagination';
import {
  AUTHORS_PAGE_SIZE,
  buildPageHref,
  paginate,
  parsePageParam,
} from '@/lib/pagination';

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = parsePageParam(pageParam);
  const authors = getAllAuthors();
  const { items: paginatedAuthors, page, totalPages, totalItems } = paginate(
    authors,
    currentPage,
    AUTHORS_PAGE_SIZE,
  );

  if (currentPage !== page) {
    redirect(buildPageHref('/authors', page));
  }

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * AUTHORS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * AUTHORS_PAGE_SIZE, totalItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        All Authors
      </h1>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Showing {rangeStart}–{rangeEnd} of {totalItems}{' '}
        {totalItems === 1 ? 'author' : 'authors'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedAuthors.map((author) => {
          const bookCount = getBooksByAuthorId(author.id).length;

          return (
            <Link
              key={author.id}
              href={`/authors/${author.id}`}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={author.imageUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      {author.name}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                      {author.nationality}
                    </p>
                  </div>
                </div>

                <p className="text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-3">
                  {author.bio}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Born: {author.birthYear}
                  </span>
                  <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-700 dark:text-zinc-300">
                    {bookCount} {bookCount === 1 ? 'book' : 'books'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={(nextPage) => buildPageHref('/authors', nextPage)}
        ariaLabel="Authors pagination"
      />
    </div>
  );
}
