import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAllChaletsClient } from "@/lib/services/client-chalets";
import { getAllPagesClient } from "@/lib/services/client-pages";
import { Chalet, Page } from "@/types";

interface AdminState {
  chalets: Chalet[];
  pages: Page[];
  loading: boolean;
  initialized: boolean;

  // Actions
  fetchData: () => Promise<void>;
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Chalet actions
  addChalet: (chalet: Chalet) => void;
  updateChalet: (id: string, chalet: Chalet) => void;
  removeChalet: (id: string) => void;

  // Page actions
  addPage: (page: Page) => void;
  updatePage: (id: string, page: Page) => void;
  removePage: (id: string) => void;

  // Helpers
  getChaletById: (id: string) => Chalet | undefined;
  getPagesForChalet: (chaletId: string) => Page[];
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      chalets: [],
      pages: [],
      loading: false,
      initialized: false,

      fetchData: async () => {
        const state = get();

        if (state.loading) return;

        try {
          set({ loading: true });
          const [chaletsData, pagesData] = await Promise.all([
            getAllChaletsClient(),
            getAllPagesClient(),
          ]);

          set({
            chalets: chaletsData,
            pages: pagesData,
            loading: false,
            initialized: true,
          });
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
          set({
            chalets: [],
            pages: [],
            loading: false,
            initialized: true,
          });
        }
      },

      initialize: async () => {
        const state = get();

        if (!state.initialized && !state.loading) {
          const { fetchData } = get();

          await fetchData();
        } else if (
          state.initialized &&
          state.chalets.length === 0 &&
          !state.loading
        ) {
          const { fetchData } = get();

          await fetchData();
        }
      },

      refreshData: async () => {
        // Force refresh même si déjà initialisé
        const { fetchData } = get();

        await fetchData();
      },

      // Chalet actions
      addChalet: (chalet: Chalet) => {
        set((state) => ({
          chalets: [...state.chalets, chalet],
        }));
      },

      updateChalet: (id: string, chalet: Chalet) => {
        set((state) => ({
          chalets: state.chalets.map((c) => (c._id === id ? chalet : c)),
        }));
      },

      removeChalet: (id: string) => {
        set((state) => ({
          chalets: state.chalets.filter((c) => c._id !== id),
          // Supprimer aussi les pages associées
          pages: state.pages.filter((p) => {
            if (!p.chalet) return true;

            return typeof p.chalet === "string"
              ? p.chalet !== id
              : p.chalet._id !== id;
          }),
        }));
      },

      // Page actions
      addPage: (page: Page) => {
        set((state) => ({
          pages: [...state.pages, page],
        }));
      },

      updatePage: (id: string, page: Page) => {
        set((state) => ({
          pages: state.pages.map((p) => (p._id === id ? page : p)),
        }));
      },

      removePage: (id: string) => {
        set((state) => ({
          pages: state.pages.filter((p) => p._id !== id),
        }));
      },

      // Helpers
      getChaletById: (id: string) => {
        const state = get();

        return state.chalets.find((c) => c._id === id);
      },

      getPagesForChalet: (chaletId: string) => {
        const state = get();

        return state.pages.filter((page) => {
          if (!page.chalet) return false;

          return typeof page.chalet === "string"
            ? page.chalet === chaletId
            : page.chalet._id === chaletId;
        });
      },
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        chalets: state.chalets,
        pages: state.pages,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loading = false;
        }
      },
      storage: {
        getItem: (name) => {
          try {
            return localStorage.getItem(name);
          } catch (error) {
            console.warn("Failed to read from localStorage:", error);

            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            console.warn(
              "Failed to write to localStorage (quota exceeded):",
              error,
            );
            // Clear old data to make space
            try {
              localStorage.removeItem(name);
              localStorage.setItem(name, value);
            } catch (retryError) {
              console.error(
                "Failed to save to localStorage even after clearing:",
                retryError,
              );
              // Continue without persistence
            }
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.warn("Failed to remove from localStorage:", error);
          }
        },
      },
    },
  ),
);
