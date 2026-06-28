import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  growth,
  positive = true,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all duration-300">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon
            size={20}
            className={iconColor}
          />
        </div>

      </div>

      {/* Footer */}

      <div className="flex items-center gap-2 mt-5">

        {positive ? (
          <TrendingUp
            size={15}
            className="text-green-600"
          />
        ) : (
          <TrendingDown
            size={15}
            className="text-red-600"
          />
        )}

        <span
          className={`text-xs font-semibold ${
            positive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {growth}
        </span>

        <span className="text-xs text-gray-400">
          vs last month
        </span>

      </div>

    </div>
  );
}