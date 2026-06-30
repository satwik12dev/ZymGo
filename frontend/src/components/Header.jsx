import { Bell } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-gray-200">

      <div className="h-full flex items-center justify-end px-8">

        <div className="flex items-center gap-6">

          {/* Notification */}

          <button className="relative">

            <Bell
              size={22}
              className="text-gray-500 hover:text-gray-700 transition"
            />

            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>

          </button>

          <ProfileDropdown />

        </div>

      </div>

    </header>
  );
}