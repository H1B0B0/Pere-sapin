"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createApiClient } from "@/lib/api";

export async function logoutAction() {
  try {
    const api = await createApiClient();

    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with logout even if API call fails
  } finally {
    // Clear the cookie on the frontend side as well
    const cookieStore = await cookies();

    cookieStore.delete("auth-token");

    // Redirect to login page
    redirect("/admin/login");
  }
}
