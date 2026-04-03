import { api } from "../lib/axios";
import type { BackofficeLog, CreateBackofficeLogDto, UpdateBackofficeLogDto } from "../Types/BackofficeLogTypes";

export const backofficeLogService = {
  getAll: async (): Promise<BackofficeLog[]> => {
    const response = await api.get("/api/BackofficeLog");
    return response.data;
  },

  getById: async (id: number): Promise<BackofficeLog> => {
    const response = await api.get(`/api/BackofficeLog/${id}`);
    return response.data;
  },

  create: async (params: CreateBackofficeLogDto): Promise<BackofficeLog> => {
    const response = await api.post("/api/BackofficeLog", params);
    return response.data;
  },

  update: async (id: number, params: UpdateBackofficeLogDto): Promise<BackofficeLog> => {
    const response = await api.put(`/api/BackofficeLog/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/BackofficeLog/${id}`);
  },
};
