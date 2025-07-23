import { chaletService } from "./chalets";
import { pageService } from "./pages";

export interface DashboardStats {
  totalChalets: number;
  totalPages: number;
  totalQRCodes: number;
  recentViews: number;
}

export interface RecentActivity {
  id: string;
  type: "page_created" | "page_updated" | "chalet_created";
  title: string;
  timestamp: string;
  chaletName?: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const [chalets, pages] = await Promise.all([
        chaletService.getAll(),
        pageService.getAll(),
      ]);

      return {
        totalChalets: chalets.length,
        totalPages: pages.length,
        totalQRCodes: pages.length, // Each page has a QR code
        recentViews: 0, // TODO: Implement analytics
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const [chalets, pages] = await Promise.all([
        chaletService.getAll(),
        pageService.getAll(),
      ]);

      const activities: RecentActivity[] = [];

      // Add recent chalets
      chalets
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 2)
        .forEach((chalet) => {
          activities.push({
            id: chalet._id,
            type: "chalet_created",
            title: chalet.name,
            timestamp: this.formatRelativeTime(chalet.createdAt),
          });
        });

      // Add recent pages
      pages
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 3)
        .forEach((page) => {
          const chaletName = page.chalet
            ? typeof page.chalet === "string"
              ? chalets.find((c) => c._id === page.chalet)?.name
              : page.chalet?.name
            : undefined;

          activities.push({
            id: page._id,
            type:
              new Date(page.createdAt).getTime() ===
              new Date(page.updatedAt).getTime()
                ? "page_created"
                : "page_updated",
            title: page.title,
            timestamp: this.formatRelativeTime(page.updatedAt),
            chaletName,
          });
        });

      return activities
        .sort(
          (a, b) =>
            this.parseRelativeTime(a.timestamp) -
            this.parseRelativeTime(b.timestamp),
        )
        .slice(0, 5);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },

  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Il y a quelques minutes";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
    } else if (diffInHours < 48) {
      return "Hier";
    } else {
      const diffInDays = Math.floor(diffInHours / 24);

      return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
    }
  },

  parseRelativeTime(timeString: string): number {
    if (timeString.includes("quelques minutes")) return 0;
    if (timeString.includes("heure")) {
      const hours = parseInt(timeString.match(/\d+/)?.[0] || "1");

      return hours;
    }
    if (timeString === "Hier") return 24;
    if (timeString.includes("jour")) {
      const days = parseInt(timeString.match(/\d+/)?.[0] || "1");

      return days * 24;
    }

    return 999;
  },
};
