import api from "./api";

// Get all orders
export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

// Create order
export async function addOrder(data) {
  const response = await api.post("/orders", null, {
    params: {
      amount: data.amount,
    },
  });

  return response.data;
}

// Complete order
export async function completeOrder(id) {
  const response = await api.put(`/orders/${id}/complete`);
  return response.data;
}

export async function createOrder(data) {
  const response = await api.post("/orders", null, {
    params: data,
  });

  return response.data;
}

export async function deleteOrder(id) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}