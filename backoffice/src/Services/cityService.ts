import { api } from "../lib/axios";
import type { City, CreateCityDto, UpdateCityDto } from "../Types/CityTypes";

export const cityService = {
  getAll: async (): Promise<City[]> => {
    const response = await api.get("/api/City");
    return response.data;
  },

  getById: async (id: number): Promise<City> => {
    const response = await api.get(`/api/City/${id}`);
    return response.data;
  },

  create: async (params: CreateCityDto): Promise<City> => {
    const response = await api.post("/api/City", params);
    return response.data;
  },

  update: async (id: number, params: UpdateCityDto): Promise<City> => {
    const response = await api.put(`/api/City/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/City/${id}`);
  },
};
