import api from "@/lib/api";
import { User, LoginDto, CreateUserDto } from "@/types";

export const authService = {
  async login(credentials: LoginDto): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/login", credentials);

    return response.data;
  },

  async register(userData: CreateUserDto): Promise<User> {
    const response = await api.post("/auth/register", userData);

    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get("/auth/profile");

    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
