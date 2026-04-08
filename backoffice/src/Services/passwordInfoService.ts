import { api } from "../lib/axios";
import type { PasswordInfo, CreatePasswordInfoDto, UpdatePasswordInfoDto } from "../Types/PasswordInfoTypes";

export const passwordInfoService = {
  getAll: async (): Promise<PasswordInfo[]> => {
    const response = await api.get("/api/PasswordInfo");
    return response.data;
  },

  getById: async (id: string): Promise<PasswordInfo> => {
    const response = await api.get(`/api/PasswordInfo/${id}`);
    return response.data;
  },

  create: async (params: CreatePasswordInfoDto): Promise<PasswordInfo> => {
    const response = await api.post("/api/PasswordInfo", params);
    return response.data;
  },

  update: async (id: string, params: UpdatePasswordInfoDto): Promise<PasswordInfo> => {
    const response = await api.put(`/api/PasswordInfo/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/PasswordInfo/${id}`);
  },
};
