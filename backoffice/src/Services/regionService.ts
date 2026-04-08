import { api } from "../lib/axios";
import type { Region, CreateRegionDto, UpdateRegionDto } from "../Types/RegionTypes";

export const regionService = {
  getAll: async (): Promise<Region[]> => {
    const response = await api.get("/api/Region");
    return response.data;
  },

  getById: async (id: number): Promise<Region> => {
    const response = await api.get(`/api/Region/${id}`);
    return response.data;
  },

  create: async (params: CreateRegionDto): Promise<Region> => {
    const response = await api.post("/api/Region", params);
    return response.data;
  },

  update: async (id: number, params: UpdateRegionDto): Promise<Region> => {
    const response = await api.put(`/api/Region/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Region/${id}`);
  },
};
