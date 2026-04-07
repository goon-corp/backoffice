import { api } from "../lib/axios";
import type {
	CreateReportDto,
	UpdateReportDto,
	ReportInfoDto,
} from "../Types/ReportTypes";
import type { PaginatedResponse } from "../Types/PaginatedResponse";

export const reportService = {
	getAll: async (): Promise<PaginatedResponse<ReportInfoDto>> => {
		const response = await api.get("/api/report");
		return response.data;
	},

	getById: async (id: string): Promise<ReportInfoDto> => {
		const response = await api.get(`/api/report/${id}`);
		return response.data;
	},

	create: async (params: CreateReportDto): Promise<ReportInfoDto> => {
		const response = await api.post("/api/report", params);
		return response.data;
	},

	update: async (
		id: string,
		params: UpdateReportDto,
	): Promise<ReportInfoDto> => {
		const response = await api.put(`/api/report/${id}`, params);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/api/report/${id}`);
	},
};
