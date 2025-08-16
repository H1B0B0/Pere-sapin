import DashboardClient from "./DashboardClient";

import { getDashboardStats, getRecentActivity } from "@/lib/services/dashboard";

export default async function DashboardServerData() {
  try {
    const [dashboardStats, recentActivityData] = await Promise.all([
      getDashboardStats(),
      getRecentActivity(),
    ]);

    return (
      <DashboardClient
        initialActivity={recentActivityData}
        initialStats={dashboardStats}
      />
    );
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard:", error);

    // Retourner des données par défaut en cas d'erreur
    const defaultStats = {
      totalChalets: 0,
      totalPages: 0,
      totalQRCodes: 0,
      recentViews: 0,
    };

    return <DashboardClient initialActivity={[]} initialStats={defaultStats} />;
  }
}
