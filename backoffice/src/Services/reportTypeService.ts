import { api } from "../lib/axios";
import type { ReportType, CreateReportTypeDto, UpdateReportTypeDto } from "../Types/ReportTypeTypes";

export const reportTypeService = {
  getAll: async (): Promise<ReportType[]> => {
    const response = await api.get("/api/ReportType");
    return response.data;
  },

  getById: async (id: string): Promise<ReportType> => {
    const response = await api.get(`/api/ReportType/${id}`);
    return response.data;
  },

  create: async (params: CreateReportTypeDto): Promise<ReportType> => {
    const response = await api.post("/api/ReportType", params);
    return response.data;
  },

  update: async (id: string, params: UpdateReportTypeDto): Promise<ReportType> => {
    const response = await api.put(`/api/ReportType/${id}`, params);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/ReportType/${id}`);
  },
};
