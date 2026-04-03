import { api } from "../lib/axios";
import type { RessourceProgression, CreateRessourceProgressionDto, UpdateRessourceProgressionDto } from "../Types/RessourceProgressionTypes";

export const ressourceProgressionService = {
  getAll: async (): Promise<RessourceProgression[]> => {
    const response = await api.get("/api/RessourceProgression");
    return response.data;
  },

  getById: async (id: string): Promise<RessourceProgression> => {
    const response = await api.get(`/api/RessourceProgression/${id}`);
    return response.data;
  },

  create: async (params: CreateRessourceProgressionDto): Promise<RessourceProgression> => {
    const response = await api.post("/api/RessourceProgression", params);
    return response.data;
  },

  update: async (id: string, params: UpdateRessourceProgressionDto): Promise<RessourceProgression> => {
    const response = await api.put(`/api/RessourceProgression/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/RessourceProgression/${id}`);
  },
};
