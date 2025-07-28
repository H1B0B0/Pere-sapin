// Client-side chalet services
import { createApiClient } from "@/lib/api";
import { Chalet, CreateChaletDto } from "@/types";

export async function getAllChaletsClient(): Promise<Chalet[]> {
  try {
    const api = await createApiClient();
    const response = await api.get("/chalets");
    return response.data;
  } catch (error) {
    console.error("Error fetching chalets:", error);
    throw error;
  }
}

export async function getChaletByIdClient(id: string): Promise<Chalet> {
  const api = await createApiClient();
  const response = await api.get(`/chalets/${id}`);
  return response.data;
}

export async function createChaletClient(data: CreateChaletDto): Promise<Chalet> {
  const api = await createApiClient();
  const response = await api.post("/chalets", data);
  return response.data;
}

export async function updateChaletClient(
  id: string,
  data: Partial<CreateChaletDto>
): Promise<Chalet> {
  const api = await createApiClient();
  const response = await api.patch(`/chalets/${id}`, data);
  return response.data;
}

export async function deleteChaletClient(id: string): Promise<void> {
  const api = await createApiClient();
  await api.delete(`/chalets/${id}`);
}

export async function downloadChaletQRCodesPDFClient(id: string): Promise<Blob> {
  const api = await createApiClient();
  const response = await api.get(`/pdf/chalet/${id}/qr-codes`, {
    responseType: "blob",
  });
  return response.data;
}

export async function checkChaletNameAvailabilityClient(name: string): Promise<{
  available: boolean;
  message: string;
}> {
  const api = await createApiClient();
  const response = await api.get(`/chalets/check-name/${encodeURIComponent(name)}`);
  return response.data;
}