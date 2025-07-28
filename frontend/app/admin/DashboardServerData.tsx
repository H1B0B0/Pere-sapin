import { getDashboardStats, getRecentActivity } from "@/lib/services/dashboard";
import DashboardClient from "./DashboardClient";

export default async function DashboardServerData() {
  try {
    const [dashboardStats, recentActivityData] = await Promise.all([
      getDashboardStats(),
      getRecentActivity(),
    ]);

    return (
      <DashboardClient 
        initialStats={dashboardStats} 
        initialActivity={recentActivityData} 
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
    
    return (
      <DashboardClient 
        initialStats={defaultStats} 
        initialActivity={[]} 
      />
    );
  }
}