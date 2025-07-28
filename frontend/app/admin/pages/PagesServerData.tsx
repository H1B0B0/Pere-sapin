import { getAllPages } from "@/lib/services/pages";
import { getAllChalets } from "@/lib/services/chalets";
import { Page, Chalet } from "@/types";
import PagesManagementClient from "./PagesManagementClient";

interface PageWithChalet extends Page {
  chaletName?: string;
}

export default async function PagesServerData() {
  try {
    const [pagesData, chaletsData] = await Promise.all([
      getAllPages(),
      getAllChalets(),
    ]);

    // Add chalet names to pages
    const pagesWithChalets: PageWithChalet[] = pagesData.map((page) => {
      const chalet = chaletsData.find((c) => {
        if (!page.chalet) return false;
        return typeof page.chalet === "string"
          ? c._id === page.chalet
          : c._id === page.chalet._id;
      });

      return {
        ...page,
        chaletName: chalet?.name,
      };
    });

    return <PagesManagementClient 
      initialPages={pagesWithChalets} 
      initialChalets={chaletsData} 
    />;
  } catch (error) {
    console.error("Erreur lors du chargement des pages:", error);
    return <PagesManagementClient initialPages={[]} initialChalets={[]} />;
  }
}