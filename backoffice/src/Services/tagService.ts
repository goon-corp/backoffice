import { api } from "../lib/axios";
import type { Tag, CreateTagDto, UpdateTagDto } from "../Types/TagTypes";

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get("/api/Tag");
    return response.data;
  },

  getById: async (id: string): Promise<Tag> => {
    const response = await api.get(`/api/Tag/${id}`);
    return response.data;
  },

  create: async (params: CreateTagDto): Promise<Tag> => {
    const response = await api.post("/api/Tag", params);
    return response.data;
  },

  update: async (id: string, params: UpdateTagDto): Promise<Tag> => {
    const response = await api.put(`/api/Tag/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/Tag/${id}`);
  },
};
