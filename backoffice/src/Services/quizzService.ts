import { api } from "../lib/axios";
import type { CreateQuizzDto, UpdateQuizzDto, QuizzInfoDto } from "../Types/QuizzTypes";

export const quizzService = {
  getAll: async (): Promise<QuizzInfoDto[]> => {
    const response = await api.get("/api/quizzes");
    return response.data;
  },

  getById: async (id: string): Promise<QuizzInfoDto> => {
    const response = await api.get(`/api/quizzes/${id}`);
    return response.data;
  },

  create: async (params: CreateQuizzDto): Promise<QuizzInfoDto> => {
    const response = await api.post("/api/quizzes", params);
    return response.data;
  },

  update: async (id: string, params: UpdateQuizzDto): Promise<QuizzInfoDto> => {
    const response = await api.put(`/api/quizzes/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/quizzes/${id}`);
  },

  participate: async (id: string): Promise<void> => {
    await api.post(`/api/quizzes/${id}/participate`);
  },
};
