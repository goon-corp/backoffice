import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { quizzService } from "../Services/quizzService";
import type { UpdateQuizzDto, QuizzInfoDto } from "../Types/QuizzTypes";

export const useGetQuizzByRessource = (ressourceId: string, options?: UseQueryOptions<QuizzInfoDto, Error>) => {
	return useQuery({
		queryKey: ["quizzes", "byRessource", ressourceId],
		queryFn: () => quizzService.getByRessource(ressourceId),
		...options,
	});
};

export const useGetQuizzes = (options?: UseQueryOptions<QuizzInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["quizzes"],
		queryFn: () => quizzService.getAll(),
		...options,
	});
};

export const useGetQuizz = (id: string, options?: UseQueryOptions<QuizzInfoDto, Error>) => {
	return useQuery({
		queryKey: ["quizzes", id],
		queryFn: () => quizzService.getById(id),
		...options,
	});
};

export const useCreateQuizz = (options?: UseMutationOptions<QuizzInfoDto, Error, FormData>) => {
	return useMutation({
		mutationFn: (formData: FormData) => quizzService.create(formData),
		...options,
	});
};

export const useUpdateQuizz = (options?: UseMutationOptions<QuizzInfoDto, Error, { id: string; params: UpdateQuizzDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => quizzService.update(id, params),
		...options,
	});
};

export const useDeleteQuizz = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => quizzService.delete(id),
		...options,
	});
};

export const useParticipateQuizz = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => quizzService.participate(id),
		...options,
	});
};
