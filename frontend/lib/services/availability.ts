"use server";
import {
  serverGet,
  serverPost,
  serverPatch,
  serverDelete,
} from "@/lib/server-api";
import {
  Availability,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from "@/types";

export async function getAllAvailabilities(): Promise<Availability[]> {
  return serverGet("/availabilities");
}

export async function getAvailabilityById(id: string): Promise<Availability> {
  return serverGet(`/availabilities/${id}`);
}

export async function getAvailabilitiesByChaletId(
  chaletId: string,
): Promise<Availability[]> {
  return serverGet(`/availabilities/chalet/${chaletId}`);
}

export async function getAvailablePeriodsForChalet(
  chaletId: string,
  startDate?: string,
  endDate?: string,
): Promise<Availability[]> {
  const params = new URLSearchParams();

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const query = params.toString() ? `?${params.toString()}` : "";

  return serverGet(`/availabilities/chalet/${chaletId}/available${query}`);
}

export async function createAvailability(
  data: CreateAvailabilityDto,
): Promise<Availability> {
  return serverPost("/availabilities", data);
}

export async function updateAvailability(
  id: string,
  data: UpdateAvailabilityDto,
): Promise<Availability> {
  return serverPatch(`/availabilities/${id}`, data);
}

export async function deleteAvailability(id: string): Promise<void> {
  await serverDelete(`/availabilities/${id}`);
}
