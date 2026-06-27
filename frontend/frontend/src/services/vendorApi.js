import api from "./api";

export async function getVendors() {
  const response = await api.get("/vendors");
  return response.data;
}

export async function addVendor(vendor) {
  const response = await api.post("/vendors", null, {
    params: {
      name: vendor.name,
      email: vendor.email,
      account_id: vendor.account_id,
    },
  });

  return response.data;
}

export async function updateVendor(id, vendor) {
  const response = await api.put(`/vendors/${id}`, null, {
    params: {
      name: vendor.name,
      email: vendor.email,
      account_id: vendor.account_id,
    },
  });

  return response.data;
}

export async function deleteVendor(id) {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
}