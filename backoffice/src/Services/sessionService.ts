import { api } from "../lib/axios";
import type { Session, CreateSessionDto, UpdateSessionDto } from "../Types/SessionTypes";

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    const response = await api.get("/api/Session");
    return response.data;
  },

  getById: async (id: string): Promise<Session> => {
    const response = await api.get(`/api/Session/${id}`);
    return response.data;
  },

  create: async (params: CreateSessionDto): Promise<Session> => {
    const response = await api.post("/api/Session", params);
    return response.data;
  },

  update: async (id: string, params: UpdateSessionDto): Promise<Session> => {
    const response = await api.put(`/api/Session/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/Session/${id}`);
  },
};
