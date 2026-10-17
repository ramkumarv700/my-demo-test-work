
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20],
  startItem = 0,
  endItem = 0,
  totalItems = 0,
  itemLabel = "items",
}) {
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Record information and page size */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>
          {totalItems === 0
            ? `Showing 0 of 0 ${itemLabel}`
            : `Showing ${startItem}–${endItem} of ${totalItems} ${itemLabel}`}
        </span>

        <label className="flex items-center gap-2">
          <span>Rows:</span>

          <select
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange(Number(event.target.value))
            }
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            aria-label={`Number of ${itemLabel} per page`}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Page navigation */}
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center gap-1"
      >
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || totalPages === 0}
          aria-label="Go to first page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          aria-label="Go to previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition ${
              currentPage === page
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={
            currentPage === totalPages || totalPages === 0
          }
          aria-label="Go to next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={
            currentPage === totalPages || totalPages === 0
          }
          aria-label="Go to last page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronsRight size={16} />
        </button>
      </nav>
    </div>
  );
}
