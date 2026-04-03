import { api } from "../lib/axios";
import type { CreateFriendsRequestDto, UpdateFriendsRequestDto, FriendsRequestInfoDto, GetFriendsRequestsParams } from "../Types/FriendsRequestTypes";

export const friendsRequestService = {
  getAll: async (params?: GetFriendsRequestsParams): Promise<FriendsRequestInfoDto[]> => {
    const response = await api.get("/api/FriendsRequest", { params });
    return response.data;
  },

  getById: async (userSenderId: string, userReceiverId: string): Promise<FriendsRequestInfoDto> => {
    const response = await api.get(`/api/FriendsRequest/${userSenderId}/${userReceiverId}`);
    return response.data;
  },

  create: async (params: CreateFriendsRequestDto): Promise<FriendsRequestInfoDto> => {
    const response = await api.post("/api/FriendsRequest", params);
    return response.data;
  },

  update: async (userSenderId: string, userReceiverId: string, params: UpdateFriendsRequestDto): Promise<FriendsRequestInfoDto> => {
    const response = await api.put(`/api/FriendsRequest/${userSenderId}/${userReceiverId}`, params);
    return response.data;
  },

  delete: async (userSenderId: string, userReceiverId: string): Promise<void> => {
    await api.delete(`/api/FriendsRequest/${userSenderId}/${userReceiverId}`);
  },
};
