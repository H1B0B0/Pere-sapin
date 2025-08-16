import axios from "axios";

// Client-side API client only
export async function createApiClient() {
  const api = axios.create({
    baseURL: "/api/proxy",
    timeout: 10000,
    withCredentials: true,
  });

  // Handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Response Error:", error.code, error.message);
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
