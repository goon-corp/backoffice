import { api } from "../lib/axios";
import type { User, UserInfoDto, UserProfileDto, CreateUserDto, UpdateUserDto } from "../Types/UserTypes";

export const userService = {
  getAll: async (): Promise<UserInfoDto[]> => {
    const response = await api.get("/api/user");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/api/user/${id}`);
    return response.data.data;
  },

  getProfile: async (id: string): Promise<UserProfileDto> => {
    const response = await api.get(`/api/user/${id}/profile`);
    return response.data.data;
  },

  getMe: async (): Promise<UserInfoDto> => {
    const response = await api.get("/api/user/me");
    return response.data.data;
  },

  create: async (params: CreateUserDto): Promise<UserInfoDto> => {
    const response = await api.post("/api/user", params);
    return response.data.data;
  },

  update: async (id: string, params: UpdateUserDto): Promise<UserInfoDto> => {
    const response = await api.put(`/api/user/${id}`, params);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/user/${id}`);
  },
};
