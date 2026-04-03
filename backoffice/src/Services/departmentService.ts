import { api } from "../lib/axios";
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../Types/DepartmentTypes";

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get("/api/Department");
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get(`/api/Department/${id}`);
    return response.data;
  },

  create: async (params: CreateDepartmentDto): Promise<Department> => {
    const response = await api.post("/api/Department", params);
    return response.data;
  },

  update: async (id: number, params: UpdateDepartmentDto): Promise<Department> => {
    const response = await api.put(`/api/Department/${id}`, params);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/Department/${id}`);
  },
};
