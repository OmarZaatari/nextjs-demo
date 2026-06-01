"use client";

import { useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import {
  PUBLISHERS_PAGE_SIZE,
  SortOrder,
  buildPageHref,
  buildQueryHref,
  paginate,
  parsePageParam,
  updateSearchParams,
} from "@/lib/pagination";

export type PublisherRow = {
  id: number;
  name: string;
  country: string;
  foundedYear: number;
  bookCount: number;
};

type SortField = "name" | "country" | "founded" | "books";

const SORT_FIELDS: SortField[] = ["name", "country", "founded", "books"];

function parseSortField(value: string | null): SortField {
  if (value && SORT_FIELDS.includes(value as SortField)) {
    return value as SortField;
  }
  return "name";
}

function parseSortOrder(value: string | null): SortOrder {
  return value === "desc" ? "desc" : "asc";
}

interface PublishersClientProps {
  publishers: PublisherRow[];
  countries: string[];
}

export default function PublishersClient({
  publishers,
  countries,
}: PublishersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") ?? "";
  const countryFilter = searchParams.get("country") ?? "";
  const sortField = parseSortField(searchParams.get("sort"));
  const sortOrder = parseSortOrder(searchParams.get("order"));
  const currentPage = parsePageParam(searchParams.get("page"));

  const navigate = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = updateSearchParams(searchParams, updates);
      router.replace(buildQueryHref("/publishers", params));
    },
    [router, searchParams],
  );

  const handleSort = useCallback(
    (field: SortField) => {
      const nextOrder: SortOrder =
        sortField === field && sortOrder === "asc" ? "desc" : "asc";
      navigate({
        sort: field,
        order: nextOrder,
        page: null,
      });
    },
    [navigate, sortField, sortOrder],
  );

  const filteredPublishers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return publishers.filter((publisher) => {
      const matchesSearch =
        query.length === 0 ||
        publisher.name.toLowerCase().includes(query) ||
        publisher.country.toLowerCase().includes(query);
      const matchesCountry =
        countryFilter === "" || publisher.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [publishers, searchQuery, countryFilter]);

  const sortedPublishers = useMemo(() => {
    const sorted = [...filteredPublishers];
    const direction = sortOrder === "asc" ? 1 : -1;

    sorted.sort((a, b) => {
      switch (sortField) {
        case "country":
          return a.country.localeCompare(b.country) * direction;
        case "founded":
          return (a.foundedYear - b.foundedYear) * direction;
        case "books":
          return (a.bookCount - b.bookCount) * direction;
        case "name":
        default:
          return a.name.localeCompare(b.name) * direction;
      }
    });

    return sorted;
  }, [filteredPublishers, sortField, sortOrder]);

  const {
    items: paginatedPublishers,
    page: safePage,
    totalPages,
    totalItems,
  } = useMemo(
    () => paginate(sortedPublishers, currentPage, PUBLISHERS_PAGE_SIZE),
    [sortedPublishers, currentPage],
  );

  useEffect(() => {
    if (currentPage !== safePage) {
      router.replace(
        buildPageHref("/publishers", safePage, searchParams),
      );
    }
  }, [currentPage, safePage, router, searchParams]);

  const rangeStart =
    totalItems === 0 ? 0 : (safePage - 1) * PUBLISHERS_PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PUBLISHERS_PAGE_SIZE, totalItems);

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return "↕";
    }
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const headerButtonClass =
    "inline-flex items-center gap-1 font-semibold text-left hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        Publishers
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="publisher-search" className="sr-only">
            Search publishers
          </label>
          <input
            id="publisher-search"
            type="search"
            value={searchQuery}
            placeholder="Search by name or country..."
            onChange={(event) => {
              navigate({
                q: event.target.value || null,
                page: null,
              });
            }}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
          />
        </div>
        <div className="sm:w-64">
          <label htmlFor="country-filter" className="sr-only">
            Filter by country
          </label>
          <select
            id="country-filter"
            value={countryFilter}
            onChange={(event) => {
              navigate({
                country: event.target.value || null,
                page: null,
              });
            }}
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {totalItems === 0
          ? "No publishers found"
          : `Showing ${rangeStart}–${rangeEnd} of ${totalItems} ${totalItems === 1 ? "publisher" : "publishers"}`}
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-950">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm text-zinc-600 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className={headerButtonClass}
                  aria-label="Sort by name"
                >
                  Name <span aria-hidden="true">{sortIndicator("name")}</span>
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm text-zinc-600 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => handleSort("country")}
                  className={headerButtonClass}
                  aria-label="Sort by country"
                >
                  Country <span aria-hidden="true">{sortIndicator("country")}</span>
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm text-zinc-600 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => handleSort("founded")}
                  className={headerButtonClass}
                  aria-label="Sort by founded year"
                >
                  Founded <span aria-hidden="true">{sortIndicator("founded")}</span>
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm text-zinc-600 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => handleSort("books")}
                  className={headerButtonClass}
                  aria-label="Sort by book count"
                >
                  Books <span aria-hidden="true">{sortIndicator("books")}</span>
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {paginatedPublishers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-zinc-600 dark:text-zinc-400"
                >
                  No publishers match your filters.
                </td>
              </tr>
            ) : (
              paginatedPublishers.map((publisher) => (
                <tr
                  key={publisher.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {publisher.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {publisher.country}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {publisher.foundedYear}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {publisher.bookCount}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link
                      href={`/publishers/${publisher.id}`}
                      className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
                    >
                      View details →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={(page) => {
          router.replace(buildPageHref("/publishers", page, searchParams));
        }}
        ariaLabel="Publishers pagination"
      />
    </div>
  );
}
