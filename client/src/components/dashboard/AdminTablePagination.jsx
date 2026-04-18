"use client";

export const ADMIN_PAGE_SIZE = 10;

/** Client-side list footer: 10 rows per page. */
export default function AdminTablePagination({ page, totalItems, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / ADMIN_PAGE_SIZE));
  if (totalItems <= ADMIN_PAGE_SIZE) return null;

  const from = (page - 1) * ADMIN_PAGE_SIZE + 1;
  const to = Math.min(page * ADMIN_PAGE_SIZE, totalItems);

  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50/90 px-3 py-3 text-[12px] text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <span className="tabular-nums">
        Showing <strong className="text-gray-900">{from}</strong>–<strong className="text-gray-900">{to}</strong> of{" "}
        <strong className="text-gray-900">{totalItems}</strong>
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-800 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
        >
          Previous
        </button>
        <span className="px-1 text-[11px] font-semibold tabular-nums text-gray-500">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-800 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
