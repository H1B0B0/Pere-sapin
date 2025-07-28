import { getAllPages } from "@/lib/services/pages";
import { getAllChalets } from "@/lib/services/chalets";
import { Page, Chalet } from "@/types";
import QRCodesManagementClient from "./QRCodesManagementClient";

interface PageWithChalet extends Page {
  chaletName?: string;
}

export default async function QRCodesServerData() {
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

    return <QRCodesManagementClient 
      initialPages={pagesWithChalets} 
      initialChalets={chaletsData} 
    />;
  } catch (error) {
    console.error("Erreur lors du chargement des QR codes:", error);
    return <QRCodesManagementClient initialPages={[]} initialChalets={[]} />;
  }
}