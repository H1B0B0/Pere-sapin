import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserProfile } from "./services/auth";

import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (user: User) => void;
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
      login: (user: User) => {
        console.log("[AUTH] Store: Login with user:", user);
        set({ user, isAuthenticated: true, initialized: true });
      },
      logout: () => {
        console.log("[AUTH] Store: Logout");
        set({ user: null, isAuthenticated: false, initialized: true });
      },
      updateUser: (user: User) => {
        set({ user });
      },
      checkAuth: async () => {
        const state = get();

        if (state.initialized) return;

        console.log("[AUTH] Store: Checking auth state...");
        set({ loading: true });

        try {
          // Check authentication with server using HTTP-only cookies
          const user = await getUserProfile();

          console.log("[AUTH] Store: User authenticated:", user);
          set({
            user,
            isAuthenticated: true,
            initialized: true,
            loading: false,
          });
        } catch (error) {
          console.error("[AUTH] Store: Error checking auth:", error);
          set({
            user: null,
            isAuthenticated: false,
            initialized: true,
            loading: false,
          });
        }
      },
      initialize: () => {
        console.log("[AUTH] Store: Initialize called");
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
