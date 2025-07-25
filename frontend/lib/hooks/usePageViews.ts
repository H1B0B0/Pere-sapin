import { useEffect } from "react";

export const usePageViews = (pageId: string) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://backend:5042";

        console.log(`Incrémentation de la vue pour la page ${pageId}`);
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("Vue incrémentée avec succès");
        } else {
          console.error("Erreur HTTP:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la vue:", error);
      }
    };

    if (pageId) {
      // Delay to avoid counting admin/bot views too quickly
      const timer = setTimeout(incrementView, 2000);

      return () => clearTimeout(timer);
    }
  }, [pageId]);
};

export const usePageStats = (pageId: string) => {
  const fetchStats = async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://backend:5042";
      const response = await fetch(`${API_BASE_URL}/pages/${pageId}/stats`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
    }

    return null;
  };

  return { fetchStats };
};
