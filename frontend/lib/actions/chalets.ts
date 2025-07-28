"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createChalet, updateChalet, deleteChalet } from "@/lib/services/chalets";
import { CreateChaletDto } from "@/types";

export async function createChaletAction(data: CreateChaletDto) {
  try {
    const chalet = await createChalet(data);
    revalidatePath("/admin/chalets");
    redirect(`/admin/chalets/${chalet._id}`);
  } catch (error: any) {
    console.error("Error creating chalet:", error);
    throw new Error(error.response?.data?.message || "Erreur lors de la création du chalet");
  }
}

export async function updateChaletAction(id: string, data: Partial<CreateChaletDto>) {
  try {
    const chalet = await updateChalet(id, data);
    revalidatePath("/admin/chalets");
    revalidatePath(`/admin/chalets/${id}`);
    return chalet;
  } catch (error: any) {
    console.error("Error updating chalet:", error);
    throw new Error(error.response?.data?.message || "Erreur lors de la modification du chalet");
  }
}

export async function deleteChaletAction(id: string) {
  try {
    await deleteChalet(id);
    revalidatePath("/admin/chalets");
  } catch (error: any) {
    console.error("Error deleting chalet:", error);
    throw new Error(error.response?.data?.message || "Erreur lors de la suppression du chalet");
  }
}