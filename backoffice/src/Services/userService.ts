import { api } from "../lib/axios";
import type { User, CreateUserDto, UpdateUserDto } from "../Types/UserTypes";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/api/user");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/api/user/${id}`);
    return response.data;
  },

  getProfile: async (id: string): Promise<User> => {
    const response = await api.get(`/api/user/profile/${id}`);
    return response.data;
  },

  create: async (params: CreateUserDto): Promise<User> => {
    const response = await api.post("/api/user", params);
    return response.data;
  },

  update: async (id: string, params: UpdateUserDto): Promise<User> => {
    const response = await api.put(`/api/user/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/user/${id}`);
  },
};
