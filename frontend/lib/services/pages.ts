"use server";
import {
  serverGet,
  serverPost,
  serverPatch,
  serverDelete,
} from "@/lib/server-api";
import { Page, CreatePageDto } from "@/types";

export async function getAllPages(): Promise<Page[]> {
  return serverGet("/pages");
}

export async function getPageById(id: string): Promise<Page> {
  return serverGet(`/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return serverGet(`/pages/slug/${slug}`);
}

export async function getPagesByChaletId(chaletId: string): Promise<Page[]> {
  return serverGet(`/pages/chalet/${chaletId}`);
}

export async function createPage(data: CreatePageDto): Promise<Page> {
  return serverPost("/pages", data);
}

export async function updatePage(
  id: string,
  data: Partial<CreatePageDto>,
): Promise<Page> {
  return serverPatch(`/pages/${id}`, data);
}

export async function deletePage(id: string): Promise<void> {
  await serverDelete(`/pages/${id}`);
}

export async function regeneratePageQRCode(id: string): Promise<Page> {
  return serverPost(`/pages/${id}/regenerate-qr`, {});
}
