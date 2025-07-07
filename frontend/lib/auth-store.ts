import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      initialized: false,
      login: (user: User, token: string) => {
        console.log("🔐 Store: Login with user:", user);
        Cookies.set("auth-token", token, { expires: 1 }); // 1 day
        set({ user, isAuthenticated: true, initialized: true });
      },
      logout: () => {
        console.log("🚪 Store: Logout");
        Cookies.remove("auth-token");
        set({ user: null, isAuthenticated: false, initialized: true });
      },
      updateUser: (user: User) => {
        set({ user });
      },
      checkAuth: async () => {
        const state = get();
        if (state.initialized) return;

        console.log("🔍 Store: Checking auth state...");
        set({ loading: true });

        const token = Cookies.get("auth-token");
        const hasUser = state.user;

        console.log("🔍 Store: Token exists:", !!token);
        console.log("🔍 Store: User exists:", !!hasUser);

        if (token) {
          if (hasUser) {
            console.log("✅ Store: User authenticated (from cache)");
            set({ isAuthenticated: true, initialized: true, loading: false });
          } else {
            console.log(
              "🔍 Store: Token found but no user, verifying with server..."
            );
            try {
              // Verify token with server and get user info
              const response = await fetch("/api/proxy/auth/profile", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                const user = await response.json();
                console.log("✅ Store: Token valid, user retrieved:", user);
                set({
                  user,
                  isAuthenticated: true,
                  initialized: true,
                  loading: false,
                });
              } else {
                console.log("❌ Store: Token invalid, clearing auth");
                Cookies.remove("auth-token");
                set({
                  user: null,
                  isAuthenticated: false,
                  initialized: true,
                  loading: false,
                });
              }
            } catch (error) {
              console.error("❌ Store: Error verifying token:", error);
              Cookies.remove("auth-token");
              set({
                user: null,
                isAuthenticated: false,
                initialized: true,
                loading: false,
              });
            }
          }
        } else {
          console.log("❌ Store: No token found");
          set({
            user: null,
            isAuthenticated: false,
            initialized: true,
            loading: false,
          });
        }
      },
      initialize: () => {
        console.log("🚀 Store: Initialize called");
        const state = get();
        if (!state.initialized && !state.loading) {
          state.checkAuth();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
