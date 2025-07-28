"use server";
import {
  serverGet,
  serverPost,
  serverPatch,
  serverDelete,
} from "@/lib/server-api";
import { Chalet, CreateChaletDto } from "@/types";

export async function getAllChalets(): Promise<Chalet[]> {
  return serverGet("/chalets");
}

export async function getChaletById(id: string): Promise<Chalet> {
  return serverGet(`/chalets/${id}`);
}

export async function createChalet(data: CreateChaletDto): Promise<Chalet> {
  return serverPost("/chalets", data);
}

export async function updateChalet(
  id: string,
  data: Partial<CreateChaletDto>
): Promise<Chalet> {
  return serverPatch(`/chalets/${id}`, data);
}

export async function deleteChalet(id: string): Promise<void> {
  await serverDelete(`/chalets/${id}`);
}

export async function downloadChaletQRCodesPDF(id: string): Promise<Blob> {
  const { serverFetchBlob } = await import("../server-api.js");
  return serverFetchBlob(`/pdf/chalet/${id}/qr-codes`);
}

export async function checkChaletNameAvailability(name: string): Promise<{
  available: boolean;
  message: string;
}> {
  return serverGet(`/chalets/check-name/${encodeURIComponent(name)}`);
}
