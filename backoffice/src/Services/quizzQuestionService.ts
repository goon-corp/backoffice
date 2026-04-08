import { api } from "../lib/axios";
import type { CreateQuizzQuestionDto, UpdateQuizzQuestionDto, CreateQuestionAnswerDto, QuizzQuestionInfoDto, QuestionAnswerInfoDto } from "../Types/QuizzQuestionTypes";

export const quizzQuestionService = {
  getAll: async (quizzId: string): Promise<QuizzQuestionInfoDto[]> => {
    const response = await api.get("/api/quizzes-questions", {
      params: { QuizzId: quizzId, size: 100 },
    });
    return response.data.items ?? response.data;
  },

  getById: async (id: string): Promise<QuizzQuestionInfoDto> => {
    const response = await api.get(`/api/quizzes-questions/${id}`);
    return response.data;
  },

  create: async (params: CreateQuizzQuestionDto): Promise<QuizzQuestionInfoDto> => {
    const response = await api.post("/api/quizzes-questions", {
      question: params.question,
      possible_answers: JSON.stringify(params.possible_answers),
      correct_answer: params.correct_answer,
      quizz_id: params.quizz_id,
    });
    return response.data;
  },

  update: async (id: string, params: UpdateQuizzQuestionDto): Promise<QuizzQuestionInfoDto> => {
    const response = await api.put(`/api/quizzes-questions/${id}`, {
      question: params.question,
      possible_answers: params.possible_answers ? JSON.stringify(params.possible_answers) : null,
      correct_answer: params.correct_answer,
    });
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
