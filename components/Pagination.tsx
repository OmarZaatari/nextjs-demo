import Link from "next/link";

interface PaginationBaseProps {
  currentPage: number;
  totalPages: number;
  ariaLabel?: string;
}

interface PaginationWithLinksProps extends PaginationBaseProps {
  buildHref: (page: number) => string;
  onPageChange?: never;
}

interface PaginationWithButtonsProps extends PaginationBaseProps {
  onPageChange: (page: number) => void;
  buildHref?: never;
}

type PaginationProps = PaginationWithLinksProps | PaginationWithButtonsProps;

const buttonClassName =
  "px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700";

const activeClassName =
  "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900";

export default function Pagination({
  currentPage,
  totalPages,
  ariaLabel = "Pagination",
  ...rest
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isLinkMode = "buildHref" in rest && Boolean(rest.buildHref);

  const handlePageChange = (page: number) => {
    if (!("onPageChange" in rest) || !rest.onPageChange) {
      return;
    }
    rest.onPageChange(page);
  };

  const NavControl = ({
    page,
    label,
    disabled,
  }: {
    page: number;
    label: string;
    disabled: boolean;
  }) => {
    if (disabled) {
      return (
        <span
          aria-disabled="true"
          className={`${buttonClassName} opacity-40 cursor-not-allowed`}
        >
          {label}
        </span>
      );
    }

    if (isLinkMode && rest.buildHref) {
      return (
        <Link href={rest.buildHref(page)} className={buttonClassName}>
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handlePageChange(page)}
        className={buttonClassName}
      >
        {label}
      </button>
    );
  };

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label={ariaLabel}
    >
      <NavControl
        page={currentPage - 1}
        label="Previous"
        disabled={currentPage <= 1}
      />
      {pages.map((page) => {
        const isActive = page === currentPage;

        if (isActive) {
          return (
            <span
              key={page}
              className={`${buttonClassName} ${activeClassName}`}
              aria-current="page"
            >
              {page}
            </span>
          );
        }

        if (isLinkMode && rest.buildHref) {
          return (
            <Link
              key={page}
              href={rest.buildHref(page)}
              className={buttonClassName}
            >
              {page}
            </Link>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            className={buttonClassName}
          >
            {page}
          </button>
        );
      })}
      <NavControl
        page={currentPage + 1}
        label="Next"
        disabled={currentPage >= totalPages}
      />
    </nav>
  );
}
