"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:5042";

export async function createApiClient() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth-token")?.value;

  const headers: Record<string, string> = {};

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers,
    timeout: 10000,
    withCredentials: true,
  });

  // Handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Response Error:", error.code, error.message);
      if (error.response?.status === 401) {
        redirect("/admin/login");
      }

      return Promise.reject(error);
    }
  );

  return api;
}
