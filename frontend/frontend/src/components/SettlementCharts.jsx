import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function SettlementCharts({ stats }) {
  const pieData = {
    labels: ["Pending", "Success", "Failed", "Paid"],
    datasets: [
      {
        data: [
          stats.pending,
          stats.success,
          stats.failed,
          stats.paid,
        ],
        backgroundColor: [
          "#facc15", // Yellow
          "#22c55e", // Green
          "#ef4444", // Red
          "#3b82f6", // Blue
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const barData = {
    labels: ["Pending", "Success", "Failed", "Paid"],
    datasets: [
      {
        label: "Number of Settlements",
        data: [
          stats.pending,
          stats.success,
          stats.failed,
          stats.paid,
        ],
        backgroundColor: [
          "#facc15",
          "#22c55e",
          "#ef4444",
          "#3b82f6",
        ],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Settlement Distribution
        </h2>

        <Pie
          data={pieData}
          options={pieOptions}
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Settlement Status
        </h2>

        <Bar
          data={barData}
          options={barOptions}
        />
      </div>
    </div>
  );
}