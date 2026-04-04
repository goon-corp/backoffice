import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { articleService } from "../Services/articleService";
import type { Article, UpdateArticleDto } from "../Types/ArticleTypes";

export const useGetArticles = (options?: UseQueryOptions<Article[], Error>) => {
	return useQuery({
		queryKey: ["articles"],
		queryFn: () => articleService.getAll(),
		...options,
	});
};

export const useGetArticle = (id: string, options?: UseQueryOptions<Article, Error>) => {
	return useQuery({
		queryKey: ["articles", id],
		queryFn: () => articleService.getById(id),
		...options,
	});
};

export const useGetArticleByRessource = (ressourceId: string, options?: UseQueryOptions<Article, Error>) => {
	return useQuery({
		queryKey: ["articles", "byRessource", ressourceId],
		queryFn: () => articleService.getByRessource(ressourceId),
		...options,
	});
};

export const useCreateArticle = (options?: UseMutationOptions<Article, Error, FormData>) => {
	return useMutation({
		mutationFn: (formData: FormData) => articleService.create(formData),
		...options,
	});
};

export const useUpdateArticle = (options?: UseMutationOptions<Article, Error, { id: string; params: UpdateArticleDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => articleService.update(id, params),
		...options,
	});
};

export const useDeleteArticle = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => articleService.delete(id),
		...options,
	});
};
