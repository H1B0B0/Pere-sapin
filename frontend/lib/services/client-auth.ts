// Client-side auth services
import { createApiClient } from "@/lib/api";
import { User, LoginDto, CreateUserDto } from "@/types";

export async function getUserProfileClient(): Promise<User> {
  const api = await createApiClient();
  const response = await api.get("/auth/profile");
  return response.data;
}

export async function loginUserClient(
  credentials: LoginDto,
): Promise<{ user: User; message: string }> {
  const api = await createApiClient();
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function registerUserClient(userData: CreateUserDto): Promise<User> {
  const api = await createApiClient();
  const response = await api.post("/auth/register", userData);
  return response.data;
}

export async function logoutUserClient(): Promise<{ message: string }> {
  const api = await createApiClient();
  const response = await api.post("/auth/logout");
  return response.data;
}