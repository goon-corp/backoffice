import { api } from "../lib/axios";
import type { UpdatePollDto, CreatePollOptionDto, PollInfoDto } from "../Types/PollTypes";

export const pollService = {
  getAll: async (): Promise<PollInfoDto[]> => {
    const response = await api.get("/api/polls");
    return response.data;
  },

  getById: async (id: string): Promise<PollInfoDto> => {
    const response = await api.get(`/api/polls/${id}`);
    return response.data;
  },

  getByRessource: async (ressourceId: string): Promise<PollInfoDto> => {
    const response = await api.get(`/api/polls/${ressourceId}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<PollInfoDto> => {
    const response = await api.post("/api/polls", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: string, params: UpdatePollDto): Promise<PollInfoDto> => {
    const response = await api.put(`/api/polls/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/polls/${id}`);
  },

  participate: async (id: string, params: CreatePollOptionDto): Promise<void> => {
    await api.post(`/api/polls/${id}/participate`, params);
  },
};
