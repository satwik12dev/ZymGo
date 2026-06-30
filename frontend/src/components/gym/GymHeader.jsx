import { BarChart3, Plus } from "lucide-react";

export default function GymHeader() {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}

      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 tracking-tight">
          Gym Management
        </h1>

        <p className="mt-2 text-gray-500 text-base sm:text-lg">
          Manage all gyms with advanced filtering
        </p>
      </div>

      {/* Right */}

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

        <button
          className="
            w-full sm:w-auto
            h-14
            px-7
            rounded-2xl
            bg-blue-500
            hover:bg-blue-600
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            shadow-blue-200/50
            transition-all
            duration-300
            hover:-translate-y-1
          "
        >
          <BarChart3 size={20} />

          Analytics
        </button>

        <button
          className="
            w-full sm:w-auto
            h-14
            px-7
            rounded-2xl
            bg-orange-500
            hover:bg-orange-600
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
            shadow-orange-200/50
            transition-all
            duration-300
            hover:-translate-y-1
          "
        >
          <Plus size={21} />

          Add Gym
        </button>

      </div>

    </div>
  );
}