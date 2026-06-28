import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Active",
    value: 225,
    color: "#22C55E",
  },
  {
    name: "Expiring",
    value: 14,
    color: "#F59E0B",
  },
  {
    name: "Inactive",
    value: 7,
    color: "#EF4444",
  },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

export default function SubscriptionChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-[420px] flex flex-col">

      <div className="mb-5">

        <h2 className="text-lg font-semibold">
          Subscription Status
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Current subscription overview
        </p>

      </div>

      <div className="relative flex-1">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              dataKey="value"
              paddingAngle={4}
              stroke="none"
            >
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <h2 className="text-3xl font-bold">
            {total}
          </h2>

          <p className="text-xs text-gray-500">
            Total Gyms
          </p>

        </div>

      </div>

      <div className="space-y-3 mt-4">

        {data.map((item) => (

          <div
            key={item.name}
            className="flex justify-between items-center"
          >

            <div className="flex items-center gap-2">

              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: item.color,
                }}
              />

              <span className="text-sm text-gray-700">
                {item.name}
              </span>

            </div>

            <span className="text-sm font-semibold">
              {item.value}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}