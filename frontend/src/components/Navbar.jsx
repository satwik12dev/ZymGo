import { Bell, CalendarDays, Search, ChevronDown } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">

          <CalendarDays size={15} />

          <span>{today}</span>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="hidden lg:flex items-center w-72 bg-gray-100 rounded-lg px-3 py-2">

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
          />

        </div>

        {/* Notification */}

        <button className="relative w-10 h-10 rounded-lg bg-gray-100 hover:bg-orange-100 transition flex items-center justify-center">

          <Bell
            size={18}
            className="text-gray-700"
          />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* User */}
        <ProfileDropdown />

      </div>

    </header>
  );
}