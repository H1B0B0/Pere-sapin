"use client";

// Exemple d'utilisation du système de store global pour les actions CRUD
import { useAdminActions } from "@/lib/hooks/useAdminActions";
import { useAdminStore } from "@/lib/stores/admin-store";
import { Button } from "@heroui/react";

export function ExampleCRUDUsage() {
  const { chalets, loading } = useAdminStore();
  const { createChalet, updateChalet, deleteChalet, createPage } = useAdminActions();

  const handleCreateChalet = async () => {
    try {
      // Créer un nouveau chalet - le store sera automatiquement mis à jour
      const newChalet = await createChalet({
        name: "Nouveau Chalet",
        description: "Description du chalet",
        location: "Localisation"
      });
      
      console.log("Chalet créé:", newChalet);
      // La sidebar et toutes les autres composants utilisant le store
      // seront automatiquement mis à jour !
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleUpdateChalet = async (chaletId: string) => {
    try {
      // Mettre à jour un chalet existant
      const updatedChalet = await updateChalet(chaletId, {
        name: "Nom modifié",
        description: "Description modifiée"
      });
      
      console.log("Chalet mis à jour:", updatedChalet);
      // Mise à jour automatique partout !
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDeleteChalet = async (chaletId: string) => {
    try {
      // Supprimer un chalet
      await deleteChalet(chaletId);
      console.log("Chalet supprimé");
      // Suppression automatique de la sidebar et partout !
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleCreatePage = async (chaletId: string) => {
    try {
      // Créer une page pour un chalet
      const newPage = await createPage({
        title: "Nouvelle Page",
        slug: "nouvelle-page",
        content: "<p>Contenu de la page</p>",
        chalet: chaletId
      });
      
      console.log("Page créée:", newPage);
      // La sidebar affichera automatiquement la nouvelle page !
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <h2>Exemple d&apos;utilisation CRUD avec store global</h2>
      
      <Button onClick={handleCreateChalet} color="primary">
        Créer un chalet
      </Button>

      {chalets.map((chalet) => (
        <div key={chalet._id} className="p-4 border rounded">
          <h3>{chalet.name}</h3>
          <div className="space-x-2 mt-2">
            <Button
              size="sm"
              onClick={() => handleUpdateChalet(chalet._id)}
              color="warning"
            >
              Modifier
            </Button>
            <Button
              size="sm"
              onClick={() => handleDeleteChalet(chalet._id)}
              color="danger"
            >
              Supprimer
            </Button>
            <Button
              size="sm"
              onClick={() => handleCreatePage(chalet._id)}
              color="success"
            >
              Ajouter une page
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}