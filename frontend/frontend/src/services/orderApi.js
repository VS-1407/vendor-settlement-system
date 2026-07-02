import api from "./api";

// Get all orders
export async function getOrders() {
  const response = await api.get("/orders");
  return response.data;
}

// Create order
export async function createOrder(amount) {
  const response = await api.post("/orders", null, {
    params: {
      amount: amount,
    },
  });

  return response.data;
}

// Complete order
export async function completeOrder(id) {
  const response = await api.put(`/orders/${id}/complete`);
  return response.data;
}

// Delete order
export async function deleteOrder(id) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}