"use server";

import { cookies } from "next/headers";

import { serverGet } from "./server-api";

import { User } from "@/types";

export async function checkAuth(): Promise<{
  isAuthenticated: boolean;
  user: User | null;
}> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return { isAuthenticated: false, user: null };
    }

    const user = await serverGet("/auth/profile");

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    console.error("Auth check failed:", error);

    return { isAuthenticated: false, user: null };
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth-token");

  return authToken?.value || null;
}
