import {
  Search,
  Funnel,
  Globe,
  Building2,
  ArrowDownAZ,
} from "lucide-react";

export default function GymFilters({
  filters,
  setFilters,
  states,
  cities,
}) {
  const updateFilter = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-7 mb-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Funnel size={18} className="text-orange-500" />

        <h3 className="text-[28px] font-bold text-gray-800">
          Advanced Filters
        </h3>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Search */}
        <div className="relative lg:col-span-3">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={filters.search}
            onChange={(e) =>
              updateFilter("search", e.target.value)
            }
            placeholder="Search gyms, owners, location..."
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-300
              pl-12
              pr-4
              text-[15px]
              outline-none
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-100
            "
          />
        </div>

        {/* States */}
        <div className="relative lg:col-span-3">

          <Globe
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          />

          <select
            value={filters.state}
            onChange={(e) =>
              updateFilter("state", e.target.value)
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-300
              pl-11
              pr-4
              appearance-none
              outline-none
              focus:border-orange-500
            "
          >
            <option value="">All States</option>

            {states.map((state) => (
              <option
                key={state.state}
                value={state.state}
              >
                {state.state}
              </option>
            ))}
          </select>
        </div>

        {/* Cities */}
        <div className="relative lg:col-span-3">

          <Building2
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
          />

          <select
            value={filters.city}
            onChange={(e) =>
              updateFilter("city", e.target.value)
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-300
              pl-11
              pr-4
              appearance-none
              outline-none
              focus:border-orange-500
            "
          >
            <option value="">All Cities</option>

            {cities.map((city) => (
              <option
                key={city.city}
                value={city.city}
              >
                {city.city}
              </option>
            ))}
          </select>
        </div>

        {/* Approval */}
        <div className="lg:col-span-3">
          <select
            value={filters.approval}
            onChange={(e) =>
              updateFilter("approval", e.target.value)
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-300
              px-4
              appearance-none
              outline-none
              focus:border-orange-500
            "
          >
            <option value="">Approved: All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-4">

        <select
          value={filters.status}
          onChange={(e) =>
            updateFilter("status", e.target.value)
          }
          className="h-14 rounded-2xl border border-gray-300 px-4 appearance-none"
        >
          <option value="">Status: All</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <select className="h-14 rounded-2xl border border-gray-300 px-4 appearance-none">
          <option>Verified: All</option>
          <option>Verified</option>
          <option>Unverified</option>
        </select>

        <select className="h-14 rounded-2xl border border-gray-300 px-4 appearance-none">
          <option>Trusted: All</option>
          <option>Trusted</option>
          <option>Not Trusted</option>
        </select>

        <select className="h-14 rounded-2xl border border-gray-300 px-4 appearance-none">
          <option>Subscription: All</option>
          <option>Subscribed</option>
          <option>No Plan</option>
        </select>

        <select className="h-14 rounded-2xl border border-gray-300 px-4 appearance-none">
          <option>Plan: All</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>

        <select className="h-14 rounded-2xl border border-gray-300 px-4 appearance-none">
          <option>Rating: All</option>
          <option>5 Stars</option>
          <option>4+ Stars</option>
          <option>3+ Stars</option>
        </select>

      </div>

      {/* Row 3 */}
      <div className="flex flex-wrap items-center gap-4 mt-5">

        <div className="relative">

          <ArrowDownAZ
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          />

          <select
            className="
              h-12
              rounded-2xl
              border
              border-gray-300
              pl-10
              pr-10
              appearance-none
            "
          >
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>A-Z</option>
            <option>Z-A</option>
          </select>

        </div>

        <select
          value={filters.limit}
          onChange={(e) =>
            updateFilter("limit", e.target.value)
          }
          className="
            h-12
            rounded-2xl
            border
            border-gray-300
            px-5
          "
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>

        <button
          className="
            h-12
            px-8
            rounded-2xl
            bg-gradient-to-r
            from-[#FF8A1D]
            to-[#FF6B00]
            text-white
            font-semibold
            shadow-lg
            hover:scale-[1.02]
            transition
          "
        >
          Apply Filters
        </button>

      </div>

    </div>
  );
}