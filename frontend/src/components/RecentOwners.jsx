import {
  Mail,
  Phone,
  CalendarDays,
  Eye,
  MoreVertical,
} from "lucide-react";

const owners = [
  {
    id: 1,
    name: "Rahul Sharma",
    gym: "Power Fitness",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    plan: "Premium",
    status: "Active",
    joined: "20 Jun 2026",
  },
  {
    id: 2,
    name: "Amit Kumar",
    gym: "Iron Temple",
    email: "amit@gmail.com",
    phone: "+91 9876501234",
    plan: "Gold",
    status: "Active",
    joined: "18 Jun 2026",
  },
  {
    id: 3,
    name: "Saurabh Singh",
    gym: "Gold Gym",
    email: "saurabh@gmail.com",
    phone: "+91 9876512345",
    plan: "Basic",
    status: "Pending",
    joined: "17 Jun 2026",
  },
  {
    id: 4,
    name: "Vikas Gupta",
    gym: "Beast Fitness",
    email: "vikas@gmail.com",
    phone: "+91 9876523456",
    plan: "Premium",
    status: "Active",
    joined: "16 Jun 2026",
  },
  {
    id: 5,
    name: "Ankit Verma",
    gym: "Fit Arena",
    email: "ankit@gmail.com",
    phone: "+91 9876534567",
    plan: "Gold",
    status: "Inactive",
    joined: "15 Jun 2026",
  },
];

const planColor = (plan) => {
  switch (plan) {
    case "Premium":
      return "bg-purple-100 text-purple-700";
    case "Gold":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const statusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";

    case "Pending":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-red-100 text-red-700";
  }
};

export default function RecentOwners() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[430px] flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b">

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Gym Owners
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Newly registered owners
          </p>
        </div>

        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
          View All
        </button>

      </div>

      {/* List */}

      <div className="flex-1 overflow-y-auto">

        {owners.map((owner) => (
          <div
            key={owner.id}
            className="flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
          >

            {/* Left */}

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                {owner.name.charAt(0)}
              </div>

              <div>

                <h3 className="text-sm font-semibold text-gray-900">
                  {owner.name}
                </h3>

                <p className="text-xs text-gray-500">
                  {owner.gym}
                </p>

                <div className="flex items-center gap-4 mt-2">

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail size={12} />
                    {owner.email}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone size={12} />
                    {owner.phone}
                  </div>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-6">

              <div className="text-right">

                <span
                  className={`px-2 py-1 rounded-full text-[11px] font-medium ${planColor(
                    owner.plan
                  )}`}
                >
                  {owner.plan}
                </span>

                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${statusColor(
                      owner.status
                    )}`}
                  >
                    {owner.status}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1 mt-2 text-xs text-gray-500">
                  <CalendarDays size={12} />
                  {owner.joined}
                </div>

              </div>

              <div className="flex gap-2">

                <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white transition flex items-center justify-center">
                  <Eye size={15} />
                </button>

                <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-800 hover:text-white transition flex items-center justify-center">
                  <MoreVertical size={15} />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}