"use server";
import { createApiClient } from "@/lib/api";
import { Page, CreatePageDto } from "@/types";

export async function getAllPages(): Promise<Page[]> {
  const api = await createApiClient();
  const response = await api.get("/pages");

  return response.data;
}

export async function getPageById(id: string): Promise<Page> {
  const api = await createApiClient();
  const response = await api.get(`/pages/${id}`);

  return response.data;
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const api = await createApiClient();
  const response = await api.get(`/pages/slug/${slug}`);

  return response.data;
}

export async function getPagesByChaletId(chaletId: string): Promise<Page[]> {
  const api = await createApiClient();
  const response = await api.get(`/pages/chalet/${chaletId}`);

  return response.data;
}

export async function createPage(data: CreatePageDto): Promise<Page> {
  const api = await createApiClient();
  const response = await api.post("/pages", data);

  return response.data;
}

export async function updatePage(
  id: string,
  data: Partial<CreatePageDto>,
): Promise<Page> {
  const api = await createApiClient();
  const response = await api.patch(`/pages/${id}`, data);

  return response.data;
}

export async function deletePage(id: string): Promise<void> {
  const api = await createApiClient();

  await api.delete(`/pages/${id}`);
}

export async function regeneratePageQRCode(id: string): Promise<Page> {
  const api = await createApiClient();
  const response = await api.post(`/pages/${id}/regenerate-qr`);

  return response.data;
}
