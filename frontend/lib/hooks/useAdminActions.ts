import { useAdminStore } from "@/lib/stores/admin-store";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, Page } from "@/types";

export const useAdminActions = () => {
  const store = useAdminStore();

  return {
    // Chalet actions with API calls and store updates
    createChalet: async (chaletData: Omit<Chalet, "_id">) => {
      try {
        const newChalet = await chaletService.create(chaletData);
        store.addChalet(newChalet);
        return newChalet;
      } catch (error) {
        console.error("Erreur lors de la création du chalet:", error);
        throw error;
      }
    },

    updateChalet: async (id: string, chaletData: Partial<Chalet>) => {
      try {
        const updatedChalet = await chaletService.update(id, chaletData);
        store.updateChalet(id, updatedChalet);
        return updatedChalet;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du chalet:", error);
        throw error;
      }
    },

    deleteChalet: async (id: string) => {
      try {
        await chaletService.delete(id);
        store.removeChalet(id);
      } catch (error) {
        console.error("Erreur lors de la suppression du chalet:", error);
        throw error;
      }
    },

    // Page actions with API calls and store updates
    createPage: async (pageData: Omit<Page, "_id">) => {
      try {
        const newPage = await pageService.create(pageData);
        store.addPage(newPage);
        return newPage;
      } catch (error) {
        console.error("Erreur lors de la création de la page:", error);
        throw error;
      }
    },

    updatePage: async (id: string, pageData: Partial<Page>) => {
      try {
        const updatedPage = await pageService.update(id, pageData);
        store.updatePage(id, updatedPage);
        return updatedPage;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la page:", error);
        throw error;
      }
    },

    deletePage: async (id: string) => {
      try {
        await pageService.delete(id);
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