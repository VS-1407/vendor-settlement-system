import StatsCard from "../components/StatsCard";
import RevenueChart from "../components/RevenueChart";
import RecentOrders from "../components/RecentOrders";

import {
  IndianRupee,
  ShoppingBag,
  Users,
  Wallet,
} from "lucide-react";

export default function Dashboard({ dashboardData, loading }) {
  return (
    <main className="flex-1 p-8 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening today.
          </p>
        </div>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Total Revenue"
          value={
            loading
              ? "Loading..."
              : `₹${dashboardData.total_revenue.toLocaleString()}`
          }
          color="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
          icon={<IndianRupee size={26} />}
        />

        <StatsCard
          title="Total Orders"
          value={
            loading
              ? "Loading..."
              : dashboardData.total_orders.toLocaleString()
          }
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
          icon={<ShoppingBag size={26} />}
        />

        <StatsCard
          title="Total Vendors"
          value={
            loading
              ? "Loading..."
              : dashboardData.total_vendors.toLocaleString()
          }
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
          icon={<Users size={26} />}
        />

        <StatsCard
          title="Total Settlements"
          value={
            loading
              ? "Loading..."
              : dashboardData.total_settlements.toLocaleString()
          }
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300"
          icon={<Wallet size={26} />}
        />

      </div>

      {/* Revenue Chart */}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Revenue Overview
        </h2>

        <RevenueChart />

      </div>

      {/* Recent Orders */}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Orders
        </h2>

        <RecentOrders />

      </div>

    </main>
  );
}