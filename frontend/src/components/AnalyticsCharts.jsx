import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ArrowRight } from 'lucide-react';

const revenueData = [
  { month: 'Apr', revenue: 0 },
  { month: 'May', revenue: 0 },
  { month: 'Jun', revenue: 0 },
  { month: 'Jul', revenue: 0 },
  { month: 'Aug', revenue: 0 },
  { month: 'Sep', revenue: 0 }
];

const subscriptionData = [
  { name: 'Active', value: 100, color: '#10B981' }
];

const AnalyticsCharts = React.memo(function AnalyticsCharts({ onViewInvoices }) {
  const formatYAxis = (tickItem) => {
    return `₹${tickItem}`;
  };

  return (
    <div className="charts-grid">
      {/* Revenue Trend Line Chart */}
      <div className="chart-card">
        <div className="card-header-flex">
          <div className="card-title">
            <h3>Revenue Trend</h3>
            <p>Last 6 months · INR</p>
          </div>
          <button className="card-link" onClick={onViewInvoices}>
            <span>View invoices</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={revenueData} 
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis 
                domain={[-1, 1]} 
                ticks={[-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1]}
                tickFormatter={formatYAxis}
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Revenue']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#F05223" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#F05223', stroke: '#F05223' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscriptions Donut Chart */}
      <div className="chart-card" style={{ alignItems: 'center' }}>
        <div className="card-header-flex" style={{ width: '100%' }}>
          <div className="card-title">
            <h3>Subscriptions</h3>
            <p>Status breakdown</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 210, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={0}
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val}%`, 'Status']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Donut Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <span style={{ width: 10, height: 10, backgroundColor: '#10B981', borderRadius: 2 }}></span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Active</span>
        </div>
      </div>
    </div>
  );
});

export default AnalyticsCharts;
