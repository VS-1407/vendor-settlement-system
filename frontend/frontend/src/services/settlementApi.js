import api from "./api";

export async function getSettlements() {
  const response = await api.get("/settlements");
  return response.data;
}

export async function getPendingSettlements() {
  const response = await api.get("/settlements/pending");
  return response.data;
}

export async function getSuccessfulSettlements() {
  const response = await api.get("/settlements/success");
  return response.data;
}

export async function getFailedSettlements() {
  const response = await api.get("/settlements/failed");
  return response.data;
}

export async function paySettlement(id) {
  const response = await api.put(`/settlements/${id}/pay`);
  return response.data;
}

export async function getSettlementsByDate(start, end) {
    const response = await api.get(
        `/settlements/date-filter?start=${start}&end=${end}`
    );

    return response.data;
}