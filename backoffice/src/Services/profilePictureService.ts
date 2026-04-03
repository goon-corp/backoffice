import { api } from "../lib/axios";
import type { ProfilePicture, CreateProfilePictureDto, UpdateProfilePictureDto } from "../Types/ProfilePictureTypes";

export const profilePictureService = {
  getAll: async (): Promise<ProfilePicture[]> => {
    const response = await api.get("/api/ProfilePicture");
    return response.data;
  },

  getById: async (id: string): Promise<ProfilePicture> => {
    const response = await api.get(`/api/ProfilePicture/${id}`);
    return response.data;
  },

  create: async (params: CreateProfilePictureDto): Promise<ProfilePicture> => {
    const response = await api.post("/api/ProfilePicture", params);
    return response.data;
  },

  update: async (id: string, params: UpdateProfilePictureDto): Promise<ProfilePicture> => {
    const response = await api.put(`/api/ProfilePicture/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/ProfilePicture/${id}`);
  },
};
