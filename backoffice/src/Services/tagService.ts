import { api } from "../lib/axios";
import type { Tag, CreateTagDto, UpdateTagDto } from "../Types/TagTypes";
import type { PaginatedResponse } from "../Types/PaginatedResponse";

export const tagService = {
	getAll: async (): Promise<PaginatedResponse<Tag>> => {
		const response = await api.get("/api/tags");
		return response.data;
	},

	getById: async (id: string): Promise<Tag> => {
		const response = await api.get(`/api/tags/${id}`);
		return response.data;
	},

	create: async (params: CreateTagDto): Promise<Tag> => {
		const response = await api.post("/api/tags", params);
		return response.data;
	},

	update: async (id: string, params: UpdateTagDto): Promise<Tag> => {
		const response = await api.put(`/api/tags/${id}`, params);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/api/tags/${id}`);
	},
};
