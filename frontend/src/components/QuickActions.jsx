import {
  Building2,
  PlusCircle,
  Users,
  UserPlus,
  Receipt,
  Newspaper,
  BarChart3,
  CreditCard,
  ClipboardList,
  Shield,
  Upload,
  Settings,
} from "lucide-react";

const actions = [
  {
    title: "Add Gym",
    icon: PlusCircle,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "All Gyms",
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Add Owner",
    icon: UserPlus,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "All Owners",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Invoices",
    icon: Receipt,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Blogs",
    icon: Newspaper,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Plans",
    icon: CreditCard,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Reports",
    icon: ClipboardList,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Admin",
    icon: Shield,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Upload",
    icon: Upload,
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Settings",
    icon: Settings,
    color: "bg-gray-100 text-gray-700",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

      {/* Header */}

      <div className="mb-5">

        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Frequently used shortcuts
        </p>

      </div>

      {/* Actions */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >

              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center mx-auto ${action.color}`}
              >

                <Icon
                  size={20}
                />

              </div>

              <h3 className="mt-3 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition">
                {action.title}
              </h3>

            </button>
          );
        })}

      </div>

    </div>
  );
}