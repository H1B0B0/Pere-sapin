"use server";

import { revalidatePath } from "next/cache";

import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "@/lib/services/availability";
import { CreateAvailabilityDto, UpdateAvailabilityDto } from "@/types";

export async function createAvailabilityAction(data: CreateAvailabilityDto) {
  try {
    const availability = await createAvailability(data);

    revalidatePath(`/admin/chalets/${data.chalet}`);
    revalidatePath("/admin/chalets");

    return { success: true, availability };
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error creating availability:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la création de la disponibilité",
    );
  }
}

export async function updateAvailabilityAction(
  id: string,
  data: UpdateAvailabilityDto,
) {
  try {
    const availability = await updateAvailability(id, data);

    revalidatePath(`/admin/chalets`);

    return { success: true, availability };
  } catch (error: any) {
    console.error("Error updating availability:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la modification de la disponibilité",
    );
  }
}

export async function deleteAvailabilityAction(id: string, chaletId?: string) {
  try {
    await deleteAvailability(id);
    if (chaletId) {
      revalidatePath(`/admin/chalets/${chaletId}`);
    }
    revalidatePath("/admin/chalets");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting availability:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la suppression de la disponibilité",
    );
  }
}
