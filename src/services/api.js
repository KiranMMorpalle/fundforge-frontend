// const BASE_URL = "http://localhost:8080/api/v1";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

function getHeaders(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}, token = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(token), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

// Auth
export const authApi = {
  login: (credentials) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  register: (userData) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(userData) }),
};

// Campaigns
export const campaignApi = {
  getAll: (params, token) => {
    const query = new URLSearchParams(params).toString();
    return request(`/campaigns?${query}`, {}, token);
  },
  getById: (id, token) => request(`/campaigns/${id}`, {}, token),
  create: (data, token) =>
    request("/campaigns", { method: "POST", body: JSON.stringify(data) }, token),
  update: (id, data, token) =>
    request(`/campaigns/${id}`, { method: "PUT", body: JSON.stringify(data) }, token),
  delete: (id, token) =>
    request(`/campaigns/${id}`, { method: "DELETE" }, token),
};

// Admin
export const adminApi = {
  getPending: (token) => request("/admin/campaigns/pending", {}, token),
  approve: (id, token) =>
    request(`/admin/campaigns/${id}/approve`, { method: "PUT" }, token),
  reject: (id, token) =>
    request(`/admin/campaigns/${id}/reject`, { method: "PUT" }, token),
};

// Donations
export const donationApi = {
  donate: (campaignId, data, token) =>
    request(`/campaigns/${campaignId}/donate`, { method: "POST", body: JSON.stringify(data) }, token),
  getDonations: (campaignId, token) =>
    request(`/campaigns/${campaignId}/donations`, {}, token),
};

// Payments
export const paymentApi = {
  createOrder: (donationId, token) =>
    request(`/payments/order/${donationId}`, { method: "POST" }, token),
  verify: (data, token) =>
    request("/payments/verify", { method: "POST", body: JSON.stringify(data) }, token),
};
