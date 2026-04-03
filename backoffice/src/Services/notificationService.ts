import { api } from "../lib/axios";
import type { Notification, CreateNotificationDto, UpdateNotificationDto } from "../Types/NotificationTypes";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get("/api/Notification");
    return response.data;
  },

  getById: async (id: number): Promise<Notification> => {
    const response = await api.get(`/api/Notification/${id}`);
    return response.data;
  },

  create: async (params: CreateNotificationDto): Promise<Notification> => {
    const response = await api.post("/api/Notification", params);
    return response.data;
  },

  update: async (id: number, params: UpdateNotificationDto): Promise<Notification> => {
    const response = await api.put(`/api/Notification/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Notification/${id}`);
  },
};
