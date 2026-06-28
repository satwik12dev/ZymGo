import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import SubscriptionChart from "../components/SubscriptionChart";
import QuickActions from "../components/QuickActions";
import RecentPayments from "../components/RecentPayments";
import ExpiringSubscriptions from "../components/ExpiringSubscriptions";
import RecentOwners from "../components/RecentOwners";
import InactiveOwners from "../components/InactiveOwners";
import WelcomeBanner from "../components/WelcomeBanner";

import {
  Building2,
  Users,
  IndianRupee,
  Clock3,
  BadgeCheck,
  AlertTriangle,
  UserX,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Gyms",
      value: "248",
      icon: Building2,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      growth: "+12%",
      positive: true,
    },
    {
      title: "Total Owners",
      value: "312",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      growth: "+8%",
      positive: true,
    },
    {
      title: "Monthly Revenue",
      value: "₹18.5L",
      icon: IndianRupee,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      growth: "+16%",
      positive: true,
    },
    {
      title: "Pending Dues",
      value: "18",
      icon: Clock3,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      growth: "-5%",
      positive: false,
    },
    {
      title: "Active Subscription",
      value: "225",
      icon: BadgeCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      growth: "+10%",
      positive: true,
    },
    {
      title: "Expiring (7 Days)",
      value: "14",
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      growth: "+2%",
      positive: true,
    },
    {
      title: "Inactive Owners",
      value: "7",
      icon: UserX,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
      growth: "-3%",
      positive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="ml-64">

        <Navbar />

        <main className="p-6 space-y-6">
            <WelcomeBanner />


          {/* Stats */}

          <section>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {stats.slice(0, 4).map((item) => (
                <StatCard
                  key={item.title}
                  {...item}
                />
              ))}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

              {stats.slice(4).map((item) => (
                <StatCard
                  key={item.title}
                  {...item}
                />
              ))}

            </div>

          </section>

          {/* Revenue + Subscription */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

            <div className="xl:col-span-2">

              <RevenueChart />

            </div>

            <SubscriptionChart />

          </section>

          {/* Quick Actions */}

          <section>

            <QuickActions />

          </section>

          {/* Recent Payments */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

            <div className="xl:col-span-2">

              <RecentPayments />

            </div>

            <ExpiringSubscriptions />

          </section>

          {/* Recent Owners */}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

            <div className="xl:col-span-2">

              <RecentOwners />

            </div>

            <InactiveOwners />

          </section>

        </main>

      </div>

    </div>
  );
}