import {
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  ArrowRight,
} from "lucide-react";

const payments = [
  {
    id: "#INV-1001",
    gym: "Power Fitness",
    owner: "Rahul Sharma",
    amount: "₹12,000",
    date: "27 Jun 2026",
    status: "Paid",
  },
  {
    id: "#INV-1002",
    gym: "Iron Temple",
    owner: "Amit Kumar",
    amount: "₹9,500",
    date: "26 Jun 2026",
    status: "Pending",
  },
  {
    id: "#INV-1003",
    gym: "Gold Gym",
    owner: "Saurabh Singh",
    amount: "₹15,000",
    date: "25 Jun 2026",
    status: "Paid",
  },
  {
    id: "#INV-1004",
    gym: "Beast Fitness",
    owner: "Vikas Gupta",
    amount: "₹8,500",
    date: "24 Jun 2026",
    status: "Failed",
  },
  {
    id: "#INV-1005",
    gym: "Fit Arena",
    owner: "Ankit Verma",
    amount: "₹18,000",
    date: "23 Jun 2026",
    status: "Paid",
  },
];

const statusBadge = (status) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          <CheckCircle2 size={14} />
          Paid
        </span>
      );

    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
          <Clock3 size={14} />
          Pending
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
          <XCircle size={14} />
          Failed
        </span>
      );
  }
};

export default function RecentPayments() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-[420px] flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Recent Payments
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Latest subscription payments
          </p>

        </div>

        <button className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium">

          View All

          <ArrowRight size={16} />

        </button>

      </div>

      {/* Table */}

      <div className="flex-1 overflow-auto">

        <table className="w-full">

          <thead className="sticky top-0 bg-gray-50">

            <tr>

              <th className="text-left px-5 py-3 text-xs uppercase font-semibold text-gray-500">
                Invoice
              </th>

              <th className="text-left px-5 py-3 text-xs uppercase font-semibold text-gray-500">
                Gym
              </th>

              <th className="text-left px-5 py-3 text-xs uppercase font-semibold text-gray-500">
                Amount
              </th>

              <th className="text-left px-5 py-3 text-xs uppercase font-semibold text-gray-500">
                Date
              </th>

              <th className="text-left px-5 py-3 text-xs uppercase font-semibold text-gray-500">
                Status
              </th>

              <th className="text-center px-5 py-3 text-xs uppercase font-semibold text-gray-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment.id}
                className="border-b border-gray-100 hover:bg-orange-50 transition"
              >

                <td className="px-5 py-4">

                  <div className="font-medium text-sm text-gray-900">
                    {payment.id}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {payment.owner}
                  </div>

                </td>

                <td className="px-5 py-4 text-sm text-gray-700">
                  {payment.gym}
                </td>

                <td className="px-5 py-4 font-semibold text-sm">
                  {payment.amount}
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                  {payment.date}
                </td>

                <td className="px-5 py-4">
                  {statusBadge(payment.status)}
                </td>

                <td className="px-5 py-4 text-center">

                  <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center transition">

                    <Eye size={16} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}