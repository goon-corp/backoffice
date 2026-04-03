import { api } from "../lib/axios";
import type { SessionMessage, CreateSessionMessageDto, UpdateSessionMessageDto } from "../Types/SessionMessageTypes";

export const sessionMessageService = {
  getAll: async (): Promise<SessionMessage[]> => {
    const response = await api.get("/api/SessionMessage");
    return response.data;
  },

  getById: async (id: string): Promise<SessionMessage> => {
    const response = await api.get(`/api/SessionMessage/${id}`);
    return response.data;
  },

  create: async (params: CreateSessionMessageDto): Promise<SessionMessage> => {
    const response = await api.post("/api/SessionMessage", params);
    return response.data;
  },

  update: async (id: string, params: UpdateSessionMessageDto): Promise<SessionMessage> => {
    const response = await api.put(`/api/SessionMessage/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/SessionMessage/${id}`);
  },
};
