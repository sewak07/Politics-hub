import React from "react";

export default function Pagination({
  page,
  setPage,
  totalPages,
  loading,
}) {
  const goPrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
      {/* Prev */}
      <button
        onClick={goPrev}
        disabled={page === 1 || loading}
        className="px-3 py-1 border rounded-md text-sm disabled:opacity-40"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          disabled={loading}
          className={`px-3 py-1 border rounded-md text-sm transition ${
            p === page
              ? "bg-red-700 text-white border-red-700"
              : "hover:bg-neutral-100"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={goNext}
        disabled={page === totalPages || loading}
        className="px-3 py-1 border rounded-md text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}