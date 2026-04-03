import { api } from "../lib/axios";
import type { Comment, CreateCommentDto, UpdateCommentDto } from "../Types/CommentTypes";

export const commentService = {
  getAll: async (): Promise<Comment[]> => {
    const response = await api.get("/api/Comment");
    return response.data;
  },

  getById: async (id: string): Promise<Comment> => {
    const response = await api.get(`/api/Comment/${id}`);
    return response.data;
  },

  create: async (params: CreateCommentDto): Promise<Comment> => {
    const response = await api.post("/api/Comment", params);
    return response.data;
  },

  update: async (id: string, params: UpdateCommentDto): Promise<Comment> => {
    const response = await api.put(`/api/Comment/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/Comment/${id}`);
  },
};
