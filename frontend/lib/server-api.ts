"use server";

import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (authToken) {
      (headers as any).Cookie = `auth-token=${authToken.value}`;
    }

    const url = `${API_BASE_URL}/api/proxy${endpoint}`;

    console.log(`[SERVER API] Fetching: ${url} with auth: ${!!authToken}`);

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    console.log(
      `[SERVER API] Response status: ${response.status} for ${endpoint}`,
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(`[SERVER API] Error response body:`, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`,
      );
    }

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error(
        `[SERVER API] JSON parse error for ${endpoint}:`,
        parseError,
      );
      console.error(`[SERVER API] Response text:`, text);
      throw new Error(`Invalid JSON response: ${text}`);
    }

    console.log(`[SERVER API] Success response for ${endpoint}:`, data);

    return data;
  } catch (error) {
    console.error(`[SERVER API] Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function serverGet(endpoint: string) {
  return serverFetch(endpoint, { method: "GET" });
}

export async function serverPost(endpoint: string, data: any) {
  return serverFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function serverPatch(endpoint: string, data: any) {
  return serverFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function serverDelete(endpoint: string) {
  return serverFetch(endpoint, { method: "DELETE" });
}

export async function serverFetchBlob(endpoint: string): Promise<Blob> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    const headers: HeadersInit = {};

    if (authToken) {
      headers.Cookie = `auth-token=${authToken.value}`;
    }

    const url = `${API_BASE_URL}/api/proxy${endpoint}`;

    console.log(`[SERVER API] Fetching blob: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  } catch (error) {
    console.error(`[SERVER API] Error fetching blob ${endpoint}:`, error);
    throw error;
  }
}
