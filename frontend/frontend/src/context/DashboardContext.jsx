import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [refreshDashboard, setRefreshDashboard] = useState(0);

  function refresh() {
    setRefreshDashboard((prev) => prev + 1);
  }

  return (
    <DashboardContext.Provider
      value={{
        refreshDashboard,
        refresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}