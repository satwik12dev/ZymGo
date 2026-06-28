import {
  UserX,
  Mail,
  Phone,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

const inactiveOwners = [
  {
    id: 1,
    name: "Rohit Sharma",
    gym: "Alpha Fitness",
    email: "rohit@gmail.com",
    phone: "+91 9876543210",
    expired: "18 Jun 2026",
    daysAgo: 9,
  },
  {
    id: 2,
    name: "Aman Verma",
    gym: "Titan Gym",
    email: "aman@gmail.com",
    phone: "+91 9876501234",
    expired: "16 Jun 2026",
    daysAgo: 11,
  },
  {
    id: 3,
    name: "Vikas Singh",
    gym: "Muscle House",
    email: "vikas@gmail.com",
    phone: "+91 9876512345",
    expired: "13 Jun 2026",
    daysAgo: 14,
  },
  {
    id: 4,
    name: "Sandeep Kumar",
    gym: "Royal Fitness",
    email: "sandeep@gmail.com",
    phone: "+91 9876523456",
    expired: "10 Jun 2026",
    daysAgo: 17,
  },
  {
    id: 5,
    name: "Anuj Sharma",
    gym: "Warrior Gym",
    email: "anuj@gmail.com",
    phone: "+91 9876598765",
    expired: "08 Jun 2026",
    daysAgo: 19,
  },
];

export default function InactiveOwners() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[430px] flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Inactive Owners
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Subscription expired
          </p>

        </div>

        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">

          <UserX
            size={18}
            className="text-red-600"
          />

        </div>

      </div>

      {/* List */}

      <div className="flex-1 overflow-y-auto">

        {inactiveOwners.map((owner) => (

          <div
            key={owner.id}
            className="px-5 py-4 border-b border-gray-100 hover:bg-red-50 transition"
          >

            <div className="flex items-start justify-between">

              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">

                  {owner.name.charAt(0)}

                </div>

                <div>

                  <h3 className="text-sm font-semibold text-gray-900">
                    {owner.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {owner.gym}
                  </p>

                </div>

              </div>

              <span className="bg-red-100 text-red-600 text-[11px] px-2 py-1 rounded-full font-medium">
                Expired
              </span>

            </div>

            <div className="mt-3 space-y-2">

              <div className="flex items-center gap-2 text-xs text-gray-500">

                <Mail size={13} />

                {owner.email}

              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">

                <Phone size={13} />

                {owner.phone}

              </div>

              <div className="flex items-center justify-between pt-1">

                <div className="flex items-center gap-2 text-xs text-gray-500">

                  <CalendarDays size={13} />

                  {owner.expired}

                </div>

                <span className="text-xs font-semibold text-red-600">

                  {owner.daysAgo} Days Ago

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t px-5 py-4 mt-auto">

        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 text-white py-2.5 text-sm font-medium transition">

          View All

          <ArrowRight size={16} />

        </button>

      </div>

    </div>
  );
}