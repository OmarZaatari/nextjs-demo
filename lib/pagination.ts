export const BOOKS_PAGE_SIZE = 6;
export const AUTHORS_PAGE_SIZE = 4;

export function parsePageParam(value: string | null | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems,
    pageSize,
  };
}

export function buildPageHref(
  basePath: string,
  page: number,
  params?: URLSearchParams,
): string {
  const search = new URLSearchParams(params?.toString() ?? "");
  if (page <= 1) {
    search.delete("page");
  } else {
    search.set("page", String(page));
  }
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
