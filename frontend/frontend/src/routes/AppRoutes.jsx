import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Vendors from "../pages/Vendors";
import Settlements from "../pages/Settlements";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes({
  dashboardData,
  loading,
}) {
  return (
    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard
              dashboardData={dashboardData}
              loading={loading}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendors"
        element={
          <ProtectedRoute>
            <Vendors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settlements"
        element={
          <ProtectedRoute>
            <Settlements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}