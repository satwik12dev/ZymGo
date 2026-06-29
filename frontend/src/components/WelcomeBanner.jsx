import { Plus, UserPlus } from "lucide-react";

export default function WelcomeBanner({user}) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between py-4">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">
          Good afternoon, Kodexive 👋
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {today} · Here's what's happening today
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button className="flex items-center gap-2 px-5 h-11 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition">

          <Plus size={18} />

          <span className="text-sm font-medium">
            Add Gym
          </span>

        </button>

        <button className="flex items-center gap-2 px-5 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition">

          <UserPlus size={18} />

          <span className="text-sm font-medium">
            Add Owner
          </span>

        </button>

      </div>

    </div>
  );
}