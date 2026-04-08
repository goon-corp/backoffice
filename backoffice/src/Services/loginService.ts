import { api } from "../lib/axios";
import type { Login, CreateLoginDto, UpdateLoginDto } from "../Types/LoginTypes";

export const loginService = {
  getAll: async (): Promise<Login[]> => {
    const response = await api.get("/api/Login");
    return response.data;
  },

  getById: async (id: number): Promise<Login> => {
    const response = await api.get(`/api/Login/${id}`);
    return response.data;
  },

  create: async (params: CreateLoginDto): Promise<Login> => {
    const response = await api.post("/api/Login", params);
    return response.data;
  },

  update: async (id: number, params: UpdateLoginDto): Promise<Login> => {
    const response = await api.put(`/api/Login/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Login/${id}`);
  },
};
