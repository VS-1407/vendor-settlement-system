import api from "./api";


export const getOverview = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const getRevenue = async () => {
  const res = await api.get("/analytics/revenue");
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/analytics/orders");
  return res.data;
};

export const getSettlementStatus = async () => {
  const res = await api.get("/analytics/settlement-status");
  return res.data;
};

export const getTopVendors = async () => {
  const res = await api.get("/analytics/top-vendors");
  return res.data;
};

export const getVendorPerformance = async () => {
  const res = await api.get("/analytics/vendor-performance");
  return res.data;
};

export const getCommissionReport = async () => {
  const res = await api.get("/analytics/commission-report");
  return res.data;
};

export const getDailyReport = async () => {
  const res = await api.get("/analytics/daily-report");
  return res.data;
};