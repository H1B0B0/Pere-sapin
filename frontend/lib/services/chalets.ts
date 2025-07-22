import api from "@/lib/api";
import { Chalet, CreateChaletDto } from "@/types";

export const chaletService = {
  async getAll(): Promise<Chalet[]> {
    const response = await api.get("/chalets");

    return response.data;
  },

  async getById(id: string): Promise<Chalet> {
    const response = await api.get(`/chalets/${id}`);

    return response.data;
  },

  async create(data: CreateChaletDto): Promise<Chalet> {
    const response = await api.post("/chalets", data);

    return response.data;
  },

  async update(id: string, data: Partial<CreateChaletDto>): Promise<Chalet> {
    const response = await api.patch(`/chalets/${id}`, data);

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/chalets/${id}`);
  },

  async downloadQRCodesPDF(id: string): Promise<void> {
    try {
      const response = await api.get(`/pdf/chalet/${id}/qr-codes`, {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chalet-${id}-qr-codes.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      throw error;
    }
  },
};
