import { useEffect, useState } from "react";
import { getRevenue } from "../services/analyticsApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


export default function RevenueChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRevenue();
    }, []);

    async function loadRevenue() {
    try {
        setLoading(true);

        const result = await getRevenue();

        setData(result);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }
}

if (loading) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 h-[450px] flex items-center justify-center">
            Loading revenue chart...
        </div>
    );
}

    return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Revenue Overview
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monthly Revenue Performance
          </p>

        </div>

      </div>

      {/* Chart */}

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3b82f6"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                stroke: "#3b82f6",
                strokeWidth: 1,
              }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                backgroundColor: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,.15)",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              fill="url(#revenueGradient)"
              stroke="#3b82f6"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#2563eb",
              }}
              activeDot={{
                r: 8,
                fill: "#2563eb",
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}