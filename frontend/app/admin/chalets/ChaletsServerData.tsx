import { getAllChalets } from "@/lib/services/chalets";
import { getAllPages } from "@/lib/services/pages";
import { Chalet } from "@/types";
import ChaletsManagementClient from "./ChaletsManagementClient";

interface ChaletWithPages extends Chalet {
  pagesCount: number;
}

export default async function ChaletsServerData() {
  try {
    const [chaletsData, allPages] = await Promise.all([
      getAllChalets(),
      getAllPages(),
    ]);

    // Add page count to each chalet
    const chaletsWithPages: ChaletWithPages[] = chaletsData.map((chalet) => ({
      ...chalet,
      pagesCount: allPages.filter((page) => {
        return typeof page.chalet === "string"
          ? page.chalet === chalet._id
          : page.chalet._id === chalet._id;
      }).length,
    }));

    return <ChaletsManagementClient initialChalets={chaletsWithPages} />;
  } catch (error) {
    console.error("Erreur lors du chargement des chalets:", error);
    return <ChaletsManagementClient initialChalets={[]} />;
  }
}
