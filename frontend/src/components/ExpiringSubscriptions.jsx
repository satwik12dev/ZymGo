import {
  CalendarDays,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const subscriptions = [
  {
    id: 1,
    owner: "Rahul Sharma",
    gym: "Power Fitness",
    plan: "Premium",
    expiry: "29 Jun 2026",
    daysLeft: 2,
  },
  {
    id: 2,
    owner: "Amit Kumar",
    gym: "Iron Temple",
    plan: "Gold",
    expiry: "01 Jul 2026",
    daysLeft: 4,
  },
  {
    id: 3,
    owner: "Saurabh Singh",
    gym: "Gold Gym",
    plan: "Basic",
    expiry: "02 Jul 2026",
    daysLeft: 5,
  },
  {
    id: 4,
    owner: "Vikas Gupta",
    gym: "Beast Fitness",
    plan: "Premium",
    expiry: "03 Jul 2026",
    daysLeft: 6,
  },
  {
    id: 5,
    owner: "Ankit Verma",
    gym: "Fit Arena",
    plan: "Gold",
    expiry: "04 Jul 2026",
    daysLeft: 7,
  },
  {
    id: 6,
    owner: "Rohit Singh",
    gym: "Muscle Hub",
    plan: "Premium",
    expiry: "05 Jul 2026",
    daysLeft: 8,
  },
];

const badgeColor = (plan) => {
  switch (plan) {
    case "Premium":
      return "bg-purple-100 text-purple-700";
    case "Gold":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ExpiringSubscriptions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[430px] flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b">

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Expiring Subscriptions
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Expiring within 7 days
          </p>
        </div>

        <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
          <AlertTriangle
            size={18}
            className="text-orange-600"
          />
        </div>

      </div>

      {/* List */}

      <div className="flex-1 overflow-y-auto">

        {subscriptions.map((item) => (

          <div
            key={item.id}
            className="px-5 py-4 border-b border-gray-100 hover:bg-orange-50 transition"
          >

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-sm font-semibold text-gray-900">
                  {item.owner}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {item.gym}
                </p>

              </div>

              <span
                className={`text-[11px] px-2 py-1 rounded-full font-medium ${badgeColor(
                  item.plan
                )}`}
              >
                {item.plan}
              </span>

            </div>

            <div className="flex items-center justify-between mt-3">

              <div className="flex items-center gap-2 text-xs text-gray-500">

                <CalendarDays size={14} />

                {item.expiry}

              </div>

              <span className="text-xs font-semibold text-red-600">
                {item.daysLeft} Days Left
              </span>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t px-5 py-4">

        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2.5 text-sm font-medium transition">

          View All

          <ArrowRight size={16} />

        </button>

      </div>

    </div>
  );
}