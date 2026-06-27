import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import api from "./services/api";
import { useDashboard } from "./context/DashboardContext";

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const [dashboardData, setDashboardData] = useState({
    total_orders: 0,
    total_vendors: 0,
    total_revenue: 0,
    total_settlements: 0,
  });

  const [loading, setLoading] = useState(true);
  const { refreshDashboard } = useDashboard();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get("/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoginPage) {
      fetchDashboard();
    }
  }, [isLoginPage, refreshDashboard]);

  if (isLoginPage) {
    return (
      <AppRoutes
        dashboardData={dashboardData}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors duration-300 flex">

      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">

        <Navbar />

        <main className="flex-1 overflow-auto p-8">
          <AppRoutes
            dashboardData={dashboardData}
            loading={loading}
          />
        </main>

      </div>

    </div>
  );
}

export default App;