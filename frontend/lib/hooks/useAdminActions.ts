import { useAdminStore } from "@/lib/stores/admin-store";
import {
  createChalet,
  updateChalet,
  deleteChalet,
} from "@/lib/services/chalets";
import { createPage, updatePage, deletePage } from "@/lib/services/pages";
import { CreateChaletDto, CreatePageDto } from "@/types";

export const useAdminActions = () => {
  const store = useAdminStore();

  return {
    // Chalet actions with API calls and store updates
    createChalet: async (chaletData: CreateChaletDto) => {
      try {
        const newChalet = await createChalet(chaletData);

        store.addChalet(newChalet);

        return newChalet;
      } catch (error) {
        console.error("Erreur lors de la création du chalet:", error);
        throw error;
      }
    },

    updateChalet: async (id: string, chaletData: Partial<CreateChaletDto>) => {
      try {
        const updatedChalet = await updateChalet(id, chaletData);

        store.updateChalet(id, updatedChalet);

        return updatedChalet;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du chalet:", error);
        throw error;
      }
    },

    deleteChalet: async (id: string) => {
      try {
        await deleteChalet(id);
        store.removeChalet(id);
      } catch (error) {
        console.error("Erreur lors de la suppression du chalet:", error);
        throw error;
      }
    },

    // Page actions with API calls and store updates
    createPage: async (pageData: CreatePageDto) => {
      try {
        const newPage = await createPage(pageData);

        store.addPage(newPage);

        return newPage;
      } catch (error) {
        console.error("Erreur lors de la création de la page:", error);
        throw error;
      }
    },

    updatePage: async (id: string, pageData: Partial<CreatePageDto>) => {
      try {
        const updatedPage = await updatePage(id, pageData);

        store.updatePage(id, updatedPage);

        return updatedPage;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la page:", error);
        throw error;
      }
    },

    deletePage: async (id: string) => {
      try {
        await deletePage(id);
        store.removePage(id);
      } catch (error) {
        console.error("Erreur lors de la suppression de la page:", error);
        throw error;
      }
    },

    // Data refresh
    refreshData: async () => {
      try {
        await store.fetchData();
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des données:", error);
        throw error;
      }
    },
  };
};
