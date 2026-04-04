import { api } from "../lib/axios";
import type {
	Comment,
	CreateCommentDto,
	UpdateCommentDto,
} from "../Types/CommentTypes";

export const commentService = {
	getAll: async (): Promise<Comment[]> => {
		const response = await api.get("/api/comments");
		return response.data;
	},

	getById: async (id: string): Promise<Comment> => {
		const response = await api.get(`/api/comments/${id}`);
		return response.data;
	},

	create: async (params: CreateCommentDto): Promise<Comment> => {
		const response = await api.post("/api/comments", params);
		return response.data;
	},

	update: async (id: string, params: UpdateCommentDto): Promise<Comment> => {
		const response = await api.put(`/api/comments/${id}`, params);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/api/comments/${id}`);
	},
};
