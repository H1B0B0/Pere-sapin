"use server";

import { createApiClient } from "@/lib/api";
import { User, LoginDto, CreateUserDto } from "@/types";

export async function loginUser(
  credentials: LoginDto
): Promise<{ user: User }> {
  const api = await createApiClient();
  const response = await api.post("/auth/login", credentials);
  console.log("Login response:", response.status, response.data);

  // Cookie is now set by the backend as HTTP-only
  return response.data;
}

export async function registerUser(userData: CreateUserDto): Promise<User> {
  const api = await createApiClient();
  const response = await api.post("/auth/register", userData);

  return response.data;
}

export async function getUserProfile(): Promise<User> {
  const api = await createApiClient();
  const response = await api.get("/auth/profile");

  return response.data;
}

export async function logoutUser(): Promise<void> {
  const api = await createApiClient();
  await api.post("/auth/logout");
}
