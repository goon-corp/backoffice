import { api } from "../lib/axios";
import type { BackofficeLogLevel, CreateBackofficeLogLevelDto, UpdateBackofficeLogLevelDto } from "../Types/BackofficeLogLevelTypes";

export const backofficeLogLevelService = {
  getAll: async (): Promise<BackofficeLogLevel[]> => {
    const response = await api.get("/api/BackofficeLogLevel");
    return response.data;
  },

  getById: async (id: number): Promise<BackofficeLogLevel> => {
    const response = await api.get(`/api/BackofficeLogLevel/${id}`);
    return response.data;
  },

  create: async (params: CreateBackofficeLogLevelDto): Promise<BackofficeLogLevel> => {
    const response = await api.post("/api/BackofficeLogLevel", params);
    return response.data;
  },

  update: async (id: number, params: UpdateBackofficeLogLevelDto): Promise<BackofficeLogLevel> => {
    const response = await api.put(`/api/BackofficeLogLevel/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/BackofficeLogLevel/${id}`);
  },
};
