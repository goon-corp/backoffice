import { api } from "../lib/axios";
import type { CreateQuizzQuestionDto, UpdateQuizzQuestionDto, CreateQuestionAnswerDto, QuizzQuestionInfoDto, QuestionAnswerInfoDto } from "../Types/QuizzQuestionTypes";

export const quizzQuestionService = {
  getAll: async (quizzId?: string): Promise<QuizzQuestionInfoDto[]> => {
    const response = await api.get("/api/quizzes-questions", {
      params: {
        page_size: 100,
        ...(quizzId ? { quizz_id: quizzId } : {}),
      },
    });
    return response.data.items ?? response.data;
  },

  getById: async (id: string): Promise<QuizzQuestionInfoDto> => {
    const response = await api.get(`/api/quizzes-questions/${id}`);
    return response.data;
  },

  create: async (params: CreateQuizzQuestionDto): Promise<QuizzQuestionInfoDto> => {
    const response = await api.post("/api/quizzes-questions", params);
    return response.data;
  },

  update: async (id: string, params: UpdateQuizzQuestionDto): Promise<QuizzQuestionInfoDto> => {
    const response = await api.put(`/api/quizzes-questions/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/quizzes-questions/${id}`);
  },

  participate: async (id: string, userId: string, params: CreateQuestionAnswerDto): Promise<void> => {
    await api.post(`/api/quizzes-questions/${id}/participate/${userId}`, params);
  },

  getAnswer: async (userId: string, quizzQuestionId: string): Promise<QuestionAnswerInfoDto> => {
    const response = await api.get(`/api/question-answers/${userId}/${quizzQuestionId}`);
    return response.data;
  },
};
