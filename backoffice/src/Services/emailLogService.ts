import { api } from "../lib/axios";
import type { EmailLog } from "../Types/EmailLogTypes";

export const emailLogService = {
  getAll: async (): Promise<EmailLog[]> => {
    const response = await api.get("/api/EmailLog");
    return response.data;
  },

  getById: async (id: number): Promise<EmailLog> => {
    const response = await api.get(`/api/EmailLog/${id}`);
    return response.data;
  },
};
