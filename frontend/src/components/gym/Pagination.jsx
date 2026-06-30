import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  pagination,
  filters,
  setFilters,
}) {
  if (!pagination || pagination.totalPages <= 1)
    return null;

  const {
    currentPage,
    totalPages,
    totalRecords,
    perPage,
  } = pagination;

  const firstRecord =
    (currentPage - 1) * perPage + 1;

  const lastRecord = Math.min(
    currentPage * perPage,
    totalRecords
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    setFilters({
      ...filters,
      page,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPages = () => {
    const pages = [];

    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(totalPages - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-3xl shadow-sm px-8 py-5">

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* Left */}

        <div className="flex flex-wrap items-center gap-4">

          <p className="text-sm text-gray-500">

            Showing

            <span className="mx-2 font-semibold text-gray-800">

              {firstRecord}

            </span>

            -

            <span className="mx-2 font-semibold text-gray-800">

              {lastRecord}

            </span>

            of

            <span className="mx-2 font-semibold text-orange-600">

              {totalRecords}

            </span>

            gyms

          </p>

          <select
            value={filters.limit}
            onChange={(e) =>
              setFilters({
                ...filters,
                limit: Number(e.target.value),
                page: 1,
              })
            }
            className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-orange-500"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2">

          {/* First */}

          <button
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Prev */}

          <button
            onClick={() =>
              changePage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Pages */}

          {getPages().map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`h-10 w-10 rounded-xl font-semibold transition

                ${
                  currentPage === page
                    ? "bg-orange-500 text-white shadow-md"
                    : "border border-gray-300 text-gray-700 hover:bg-orange-50"
                }
              `}
            >
              {page}
            </button>
          ))}

          {/* Next */}

          <button
            onClick={() =>
              changePage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>

          {/* Last */}

          <button
            onClick={() =>
              changePage(totalPages)
            }
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronsRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}