"use server";
import { createApiClient } from "@/lib/api";
import { Chalet, CreateChaletDto } from "@/types";

export async function getAllChalets(): Promise<Chalet[]> {
  const api = await createApiClient();
  const response = await api.get("/chalets");

  return response.data;
}

export async function getChaletById(id: string): Promise<Chalet> {
  const api = await createApiClient();
  const response = await api.get(`/chalets/${id}`);

  return response.data;
}

export async function createChalet(data: CreateChaletDto): Promise<Chalet> {
  const api = await createApiClient();
  const response = await api.post("/chalets", data);

  return response.data;
}

export async function updateChalet(
  id: string,
  data: Partial<CreateChaletDto>,
): Promise<Chalet> {
  const api = await createApiClient();
  const response = await api.patch(`/chalets/${id}`, data);

  return response.data;
}

export async function deleteChalet(id: string): Promise<void> {
  const api = await createApiClient();

  await api.delete(`/chalets/${id}`);
}

export async function downloadChaletQRCodesPDF(id: string): Promise<Blob> {
  const api = await createApiClient();
  const response = await api.get(`/pdf/chalet/${id}/qr-codes`, {
    responseType: "blob",
  });

  return response.data;
}
