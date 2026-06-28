import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 59000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 68000 },
  { month: "Aug", revenue: 75000 },
  { month: "Sep", revenue: 82000 },
  { month: "Oct", revenue: 79000 },
  { month: "Nov", revenue: 90000 },
  { month: "Dec", revenue: 98000 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-2">
        <p className="text-xs text-gray-500">
          {payload[0].payload.month}
        </p>

        <p className="text-lg font-bold text-orange-500">
          ₹ {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-[420px] flex flex-col">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-lg font-semibold text-gray-900">
            Revenue Trend
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Monthly revenue overview
          </p>

        </div>

        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500">
          <option>This Year</option>
          <option>Last Year</option>
        </select>

      </div>

      {/* Chart */}

      <div className="flex-1">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={revenueData}
            margin={{
              top: 10,
              right: 20,
              left: -10,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) => `₹${value / 1000}k`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#f97316",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#ea580c",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}