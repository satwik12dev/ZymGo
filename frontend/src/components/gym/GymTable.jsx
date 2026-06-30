import GymRow from "./GymRow";

export default function GymTable({
  gyms,
  loading,
  pagination,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-20">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-500 font-medium">
            Loading gyms...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-8 py-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">

            Gym Directory

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            {pagination.totalRecords} registered gyms

          </p>

        </div>

        <div className="text-sm text-gray-500">

          Showing{" "}

          <span className="font-semibold text-gray-700">

            {(pagination.currentPage - 1) *
              pagination.perPage +
              1}

          </span>

          {" "}to{" "}

          <span className="font-semibold text-gray-700">

            {Math.min(
              pagination.currentPage *
                pagination.perPage,
              pagination.totalRecords
            )}

          </span>

          {" "}of{" "}

          <span className="font-semibold text-orange-600">

            {pagination.totalRecords}

          </span>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-[1500px] w-full">

          <thead className="bg-gray-50 border-b border-gray-200">

            <tr className="text-sm font-semibold text-gray-600">

              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>

              <th className="px-6 py-4 text-left">
                Gym
              </th>

              <th className="px-6 py-4 text-left">
                Owner
              </th>

              <th className="px-6 py-4 text-left">
                Contact
              </th>

              <th className="px-6 py-4 text-left">
                Location
              </th>

              <th className="px-6 py-4 text-center">
                Type
              </th>

              <th className="px-6 py-4 text-center">
                Approval
              </th>

              <th className="px-6 py-4 text-center">
                Badges
              </th>

              <th className="px-6 py-4 text-center">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Created
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {gyms.length > 0 ? (

              gyms.map((gym) => (

                <GymRow
                  key={gym.id}
                  gym={gym}
                />

              ))

            ) : (

              <tr>

                <td
                  colSpan={11}
                  className="py-24 text-center"
                >

                  <div className="flex flex-col items-center gap-3">

                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">

                      <span className="text-3xl">

                        🏋️

                      </span>

                    </div>

                    <h3 className="text-lg font-semibold text-gray-700">

                      No Gyms Found

                    </h3>

                    <p className="text-gray-500">

                      Try changing your filters or add a new gym.

                    </p>

                  </div>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="px-8 py-5 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">

        <span>

          Total Records :

          <span className="font-semibold text-orange-600 ml-2">

            {pagination.totalRecords}

          </span>

        </span>

        <span>

          Page{" "}

          <span className="font-semibold text-gray-700">

            {pagination.currentPage}

          </span>

          {" "}of{" "}

          <span className="font-semibold text-gray-700">

            {pagination.totalPages}

          </span>

        </span>

      </div>

    </div>
  );
}