// Client-side availability services
import { createApiClient } from "@/lib/api";
import {
  Availability,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from "@/types";

export async function getAllAvailabilitiesClient(): Promise<Availability[]> {
  const api = await createApiClient();
  const response = await api.get("/availabilities");

  return response.data;
}

export async function getAvailabilityByIdClient(
  id: string,
): Promise<Availability> {
  const api = await createApiClient();
  const response = await api.get(`/availabilities/${id}`);

  return response.data;
}

export async function getAvailabilitiesByChaletIdClient(
  chaletId: string,
): Promise<Availability[]> {
  const api = await createApiClient();
  const response = await api.get(`/availabilities/chalet/${chaletId}`);

  return response.data;
}

export async function getAvailablePeriodsForChaletClient(
  chaletId: string,
  startDate?: string,
  endDate?: string,
): Promise<Availability[]> {
  const api = await createApiClient();
  const params = new URLSearchParams();

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await api.get(
    `/availabilities/chalet/${chaletId}/available${query}`,
  );

  return response.data;
}

export async function createAvailabilityClient(
  data: CreateAvailabilityDto,
): Promise<Availability> {
  const api = await createApiClient();
  const response = await api.post("/availabilities", data);

  return response.data;
}

export async function updateAvailabilityClient(
  id: string,
  data: UpdateAvailabilityDto,
): Promise<Availability> {
  const api = await createApiClient();
  const response = await api.patch(`/availabilities/${id}`, data);

  return response.data;
}

export async function deleteAvailabilityClient(id: string): Promise<void> {
  const api = await createApiClient();

  await api.delete(`/availabilities/${id}`);
}
