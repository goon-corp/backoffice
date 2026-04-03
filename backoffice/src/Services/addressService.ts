import { api } from "../lib/axios";
import type { Address, CreateAddressDto, UpdateAddressDto } from "../Types/AddressTypes";

export const addressService = {
  getAll: async (): Promise<Address[]> => {
    const response = await api.get("/api/Address");
    return response.data;
  },

  getById: async (id: number): Promise<Address> => {
    const response = await api.get(`/api/Address/${id}`);
    return response.data;
  },

  create: async (params: CreateAddressDto): Promise<Address> => {
    const response = await api.post("/api/Address", params);
    return response.data;
  },

  update: async (id: number, params: UpdateAddressDto): Promise<Address> => {
    const response = await api.put(`/api/Address/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Address/${id}`);
  },
};
