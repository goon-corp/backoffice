import { api } from "../lib/axios";
import type { CreatePollOptionDto, UpdatePollOptionDto, PollOptionInfoDto } from "../Types/PollOptionTypes";
import type { PaginatedResponse } from "../Types/PaginatedResponse";

export const pollOptionService = {
  getAll: async (): Promise<PaginatedResponse<PollOptionInfoDto>> => {
    const response = await api.get("/api/PollOption");
    return response.data;
  },

  getById: async (id: string): Promise<PollOptionInfoDto> => {
    const response = await api.get(`/api/PollOption/${id}`);
    return response.data;
  },

  create: async (params: CreatePollOptionDto): Promise<PollOptionInfoDto> => {
    const response = await api.post("/api/PollOption", params);
    return response.data;
  },

  update: async (id: string, params: UpdatePollOptionDto): Promise<PollOptionInfoDto> => {
    const response = await api.put(`/api/PollOption/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/PollOption/${id}`);
  },
};
