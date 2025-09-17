import ChaletsManagementClient from "./ChaletsManagementClient";
import { getAllChalets } from "@/lib/services/chalets";
import { getAllPages } from "@/lib/services/pages";
import { ChaletWithPages } from "@/lib/chalets-store";

export default async function ChaletsManagement() {
  const [chaletsData, allPages] = await Promise.all([
    getAllChalets(),
    getAllPages(),
  ]);

  // Add page count to each chalet
  const chalets: ChaletWithPages[] = chaletsData.map((chalet) => ({
    ...chalet,
    pagesCount: allPages.filter((page) => {
      return typeof page.chalet === "string"
        ? page.chalet === chalet._id
        : page.chalet._id === chalet._id;
    }).length,
  }));
  
  return <ChaletsManagementClient initialChalets={chalets} />;
}
