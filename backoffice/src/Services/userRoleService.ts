import { api } from "../lib/axios";
import type { UserRole, CreateUserRoleDto, UpdateUserRoleDto } from "../Types/UserRoleTypes";

export const userRoleService = {
  getAll: async (): Promise<UserRole[]> => {
    const response = await api.get("/api/UserRole");
    return response.data;
  },

  getById: async (id: string): Promise<UserRole> => {
    const response = await api.get(`/api/UserRole/${id}`);
    return response.data;
  },

  create: async (params: CreateUserRoleDto): Promise<UserRole> => {
    const response = await api.post("/api/UserRole", params);
    return response.data;
  },

  update: async (id: string, params: UpdateUserRoleDto): Promise<UserRole> => {
    const response = await api.put(`/api/UserRole/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/UserRole/${id}`);
  },
};
