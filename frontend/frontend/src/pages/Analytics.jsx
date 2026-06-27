import { useEffect, useState } from "react";

import {
  getOverview,
  getRevenue,
  getOrders,
  getSettlementStatus,
  getTopVendors,
  getCommissionReport,
} from "../services/analyticsApi";

export default function Analytics() {
  const [overview, setOverview] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({});
  const [vendors, setVendors] = useState([]);
  const [commission, setCommission] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const [
        overviewData,
        revenueData,
        orderData,
        statusData,
        vendorData,
        commissionData,
      ] = await Promise.all([
        getOverview(),
        getRevenue(),
        getOrders(),
        getSettlementStatus(),
        getTopVendors(),
        getCommissionReport(),
      ]);

      setOverview(overviewData);
      setRevenue(revenueData);
      setOrders(orderData);
      setStatus(statusData);
      setVendors(vendorData);
      setCommission(commissionData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Analytics Dashboard
      </h1>

      <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-auto text-sm">
        {JSON.stringify(
          {
            overview,
            revenue,
            orders,
            status,
            vendors,
            commission,
          },
          null,
          2
        )}
      </pre>

    </div>
  );
}