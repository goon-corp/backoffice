import { api } from "../lib/axios";
import type { UpdateEventDto, ReturnEventDto, ReturnEventMemberDto, GetEventMembersParams } from "../Types/EventTypes";

export const eventService = {
  create: async (formData: FormData): Promise<ReturnEventDto> => {
    const response = await api.post("/api/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (eventId: string, params: UpdateEventDto): Promise<ReturnEventDto> => {
    const response = await api.put(`/api/events/${eventId}`, params);
    return response.data;
  },

  delete: async (eventId: string): Promise<void> => {
    await api.delete(`/api/events/${eventId}`);
  },

  getByRessource: async (ressourceId: string): Promise<ReturnEventDto> => {
    const response = await api.get(`/api/events/${ressourceId}`);
    return response.data;
  },

  getMembers: async (eventId: string, params?: GetEventMembersParams): Promise<ReturnEventMemberDto[]> => {
    const response = await api.get(`/api/events/${eventId}/members`, { params });
    return response.data;
  },

  addMember: async (eventId: string, userId: string): Promise<void> => {
    await api.post(`/api/events/${eventId}/members/${userId}`);
  },

  removeMember: async (eventId: string, userId: string): Promise<void> => {
    await api.delete(`/api/events/${eventId}/members/${userId}`);
  },

  join: async (eventId: string): Promise<void> => {
    await api.post(`/api/events/${eventId}/members/join`);
  },

  leave: async (eventId: string): Promise<void> => {
    await api.delete(`/api/events/${eventId}/members/leave`);
  },
};
