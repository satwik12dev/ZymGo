import {
  Building2,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Star,
  CreditCard,
} from "lucide-react";

const cards = [
  {
    key: "total",
    title: "Total",
    icon: Building2,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    valueColor: "text-gray-900",
  },
  {
    key: "active",
    title: "Active",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    valueColor: "text-green-600",
  },
  {
    key: "inactive",
    title: "Inactive",
    icon: XCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    valueColor: "text-red-600",
  },
  {
    key: "verified",
    title: "Verified",
    icon: BadgeCheck,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    valueColor: "text-sky-600",
  },
  {
    key: "trusted",
    title: "Trusted",
    icon: Star,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    valueColor: "text-purple-600",
  },
  {
    key: "subscribed",
    title: "Subscribed",
    icon: CreditCard,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-600",
  },
];

export default function GymStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              px-5
              py-4
              shadow-sm
              hover:shadow-md
              transition-all
            "
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`
                  h-11
                  w-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${card.iconBg}
                `}
              >
                <Icon
                  size={20}
                  className={card.iconColor}
                />
              </div>

              {/* Text */}
              <div>
                <h2
                  className={`text-[36px] leading-none font-bold ${card.valueColor}`}
                >
                  {stats?.[card.key] ?? 0}
                </h2>

                <p className="mt-1 text-[15px] text-gray-500 font-medium">
                  {card.title}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}