import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAllChalets } from "./services/chalets";
import { getAllPages } from "./services/pages";
import { Chalet } from "@/types";

export interface ChaletWithPages extends Chalet {
  pagesCount: number;
}

interface ChaletsState {
  chalets: ChaletWithPages[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  // Actions
  fetchChalets: () => Promise<void>;
  addChalet: (chalet: ChaletWithPages) => void;
  updateChalet: (id: string, chalet: Partial<ChaletWithPages>) => void;
  removeChalet: (id: string) => void;
  clearError: () => void;
  // Helpers
  getChaletById: (id: string) => ChaletWithPages | undefined;
  shouldRefetch: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useChaletsStore = create<ChaletsState>()(
  persist(
    (set, get) => ({
      chalets: [],
      loading: false,
      error: null,
      lastFetch: null,

      fetchChalets: async () => {
        const state = get();

        // Don't fetch if we're already loading or if cache is still valid
        if (
          state.loading ||
          (!state.shouldRefetch() && state.chalets.length > 0)
        ) {
          return;
        }

        console.log("[CHALETS] Store: Fetching chalets...");
        set({ loading: true, error: null });

        try {
          const [chaletsData, allPages] = await Promise.all([
            getAllChalets(),
            getAllPages(),
          ]);

          // Add page count to each chalet
          const chaletsWithPages: ChaletWithPages[] = chaletsData.map(
            (chalet) => ({
              ...chalet,
              pagesCount: allPages.filter((page) => {
                return typeof page.chalet === "string"
                  ? page.chalet === chalet._id
                  : page.chalet._id === chalet._id;
              }).length,
            })
          );

          console.log(
            "[CHALETS] Store: Successfully fetched chalets:",
            chaletsWithPages.length
          );
          set({
            chalets: chaletsWithPages,
            loading: false,
            error: null,
            lastFetch: Date.now(),
          });
        } catch (error) {
          console.error("[CHALETS] Store: Error fetching chalets:", error);
          set({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Erreur lors du chargement des chalets",
          });
        }
      },

      addChalet: (chalet: ChaletWithPages) => {
        console.log("[CHALETS] Store: Adding chalet:", chalet.name);
        set((state) => ({
          chalets: [...state.chalets, chalet],
        }));
      },

      updateChalet: (id: string, updatedChalet: Partial<ChaletWithPages>) => {
        console.log("[CHALETS] Store: Updating chalet:", id);
        set((state) => ({
          chalets: state.chalets.map((chalet) =>
            chalet._id === id ? { ...chalet, ...updatedChalet } : chalet
          ),
        }));
      },

      removeChalet: (id: string) => {
        console.log("[CHALETS] Store: Removing chalet:", id);
        set((state) => ({
          chalets: state.chalets.filter((chalet) => chalet._id !== id),
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      getChaletById: (id: string) => {
        return get().chalets.find((chalet) => chalet._id === id);
      },

      shouldRefetch: () => {
        const state = get();
        if (!state.lastFetch) return true;
        return Date.now() - state.lastFetch > CACHE_DURATION;
      },
    }),
    {
      name: "chalets-storage",
      partialize: (state) => ({
        chalets: state.chalets,
        lastFetch: state.lastFetch,
      }),
    }
  )
);
