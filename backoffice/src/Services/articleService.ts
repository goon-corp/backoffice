import { api } from "../lib/axios";
import type {
	Article,
	CreateArticleDto,
	UpdateArticleDto,
} from "../Types/ArticleTypes";

export const articleService = {
	getAll: async (): Promise<Article[]> => {
		const response = await api.get("/api/articles");
		return response.data;
	},

	getById: async (id: string): Promise<Article> => {
		const response = await api.get(`/api/articles/${id}`);
		return response.data;
	},

	getByRessource: async (ressourceId: string): Promise<Article> => {
		const response = await api.get(`/api/articles/${ressourceId}`);
		return response.data;
	},

	create: async (params: CreateArticleDto): Promise<Article> => {
		const response = await api.post("/api/articles", params);
		return response.data;
	},

	update: async (id: string, params: UpdateArticleDto): Promise<Article> => {
		const response = await api.put(`/api/articles/${id}`, params);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/api/articles/${id}`);
	},
};
