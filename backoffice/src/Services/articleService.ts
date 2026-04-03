import { api } from "../lib/axios";
import type { Article, CreateArticleDto, UpdateArticleDto } from "../Types/ArticleTypes";

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await api.get("/api/Article");
    return response.data;
  },

  getById: async (id: string): Promise<Article> => {
    const response = await api.get(`/api/Article/${id}`);
    return response.data;
  },

  create: async (params: CreateArticleDto): Promise<Article> => {
    const response = await api.post("/api/Article", params);
    return response.data;
  },

  update: async (id: string, params: UpdateArticleDto): Promise<Article> => {
    const response = await api.put(`/api/Article/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/Article/${id}`);
  },
};
