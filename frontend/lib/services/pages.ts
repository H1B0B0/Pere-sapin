import api from "@/lib/api";
import { Page, CreatePageDto } from "@/types";

export const pageService = {
  async getAll(): Promise<Page[]> {
    const response = await api.get("/pages");

    return response.data;
  },

  async getById(id: string): Promise<Page> {
    const response = await api.get(`/pages/${id}`);

    return response.data;
  },

  async getBySlug(slug: string): Promise<Page> {
    const response = await api.get(`/pages/slug/${slug}`);

    return response.data;
  },

  async getByChaletId(chaletId: string): Promise<Page[]> {
    const response = await api.get(`/pages/chalet/${chaletId}`);

    return response.data;
  },

  async create(data: CreatePageDto): Promise<Page> {
    const response = await api.post("/pages", data);

    return response.data;
  },

  async update(id: string, data: Partial<CreatePageDto>): Promise<Page> {
    const response = await api.patch(`/pages/${id}`, data);

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/pages/${id}`);
  },

  async regenerateQRCode(id: string): Promise<Page> {
    const response = await api.post(`/pages/${id}/regenerate-qr`);

    return response.data;
  },
};
