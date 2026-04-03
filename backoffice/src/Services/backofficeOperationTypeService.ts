import { api } from "../lib/axios";
import type { BackofficeOperationType, CreateBackofficeOperationTypeDto, UpdateBackofficeOperationTypeDto } from "../Types/BackofficeOperationTypeTypes";

export const backofficeOperationTypeService = {
  getAll: async (): Promise<BackofficeOperationType[]> => {
    const response = await api.get("/api/BackofficeOperationType");
    return response.data;
  },

  getById: async (id: number): Promise<BackofficeOperationType> => {
    const response = await api.get(`/api/BackofficeOperationType/${id}`);
    return response.data;
  },

  create: async (params: CreateBackofficeOperationTypeDto): Promise<BackofficeOperationType> => {
    const response = await api.post("/api/BackofficeOperationType", params);
    return response.data;
  },

  update: async (id: number, params: UpdateBackofficeOperationTypeDto): Promise<BackofficeOperationType> => {
    const response = await api.put(`/api/BackofficeOperationType/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/BackofficeOperationType/${id}`);
  },
};
