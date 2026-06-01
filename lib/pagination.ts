export const BOOKS_PAGE_SIZE = 6;
export const AUTHORS_PAGE_SIZE = 4;
export const PUBLISHERS_PAGE_SIZE = 5;

export type SortOrder = "asc" | "desc";

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

export function updateSearchParams(
  base: URLSearchParams | string | undefined,
  updates: Record<string, string | null | undefined>,
): URLSearchParams {
  const params = new URLSearchParams(
    typeof base === "string" ? base : (base?.toString() ?? ""),
  );

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  return params;
}

export function buildQueryHref(
  basePath: string,
  params: URLSearchParams,
): string {
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
