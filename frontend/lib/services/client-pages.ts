// Client-side page services
import { createApiClient } from "@/lib/api";
import { Page, CreatePageDto } from "@/types";

export async function getAllPagesClient(): Promise<Page[]> {
  try {
    const api = await createApiClient();
    const response = await api.get("/pages");
    return response.data;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
}

export async function getPageByIdClient(id: string): Promise<Page> {
  const api = await createApiClient();
  const response = await api.get(`/pages/${id}`);
  return response.data;
}

export async function getPageBySlugClient(slug: string): Promise<Page> {
  const api = await createApiClient();
  const response = await api.get(`/pages/slug/${slug}`);
  return response.data;
}

export async function getPagesByChaletIdClient(chaletId: string): Promise<Page[]> {
  const api = await createApiClient();
  const response = await api.get(`/pages/chalet/${chaletId}`);
  return response.data;
}

export async function createPageClient(data: CreatePageDto): Promise<Page> {
  const api = await createApiClient();
  const response = await api.post("/pages", data);
  return response.data;
}

export async function updatePageClient(
  id: string,
  data: Partial<CreatePageDto>
): Promise<Page> {
  const api = await createApiClient();
  const response = await api.patch(`/pages/${id}`, data);
  return response.data;
}

export async function deletePageClient(id: string): Promise<void> {
  const api = await createApiClient();
  await api.delete(`/pages/${id}`);
}

export async function regeneratePageQRCodeClient(id: string): Promise<Page> {
  const api = await createApiClient();
  const response = await api.post(`/pages/${id}/regenerate-qr`);
  return response.data;
}