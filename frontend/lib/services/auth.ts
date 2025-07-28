"use server";
import { serverGet, serverPost } from "@/lib/server-api";
import { User, LoginDto, CreateUserDto } from "@/types";

export async function loginUser(
  credentials: LoginDto,
): Promise<{ user: User; message: string }> {
  return serverPost("/auth/login", credentials);
}

export async function registerUser(userData: CreateUserDto): Promise<User> {
  return serverPost("/auth/register", userData);
}

export async function getUserProfile(): Promise<User> {
  return serverGet("/auth/profile");
}

export async function logoutUser(): Promise<{ message: string }> {
  return serverPost("/auth/logout", {});
}
