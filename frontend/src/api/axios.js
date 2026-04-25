import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// REQUEST: attach token safely
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE: DO NOT AUTO-LOGOUT ON EVERY ERROR
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    // ONLY logout on REAL auth failure
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;