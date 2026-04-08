import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { quizzQuestionService } from "../Services/quizzQuestionService";
import type { CreateQuizzQuestionDto, UpdateQuizzQuestionDto, CreateQuestionAnswerDto, QuizzQuestionInfoDto, QuestionAnswerInfoDto } from "../Types/QuizzQuestionTypes";

export const useGetQuizzQuestions = (quizzId?: string, options?: UseQueryOptions<QuizzQuestionInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["quizz-questions", quizzId],
		queryFn: () => quizzQuestionService.getAll(quizzId),
		enabled: !!quizzId,
		...options,
	});
};

export const useGetQuizzQuestion = (id: string, options?: UseQueryOptions<QuizzQuestionInfoDto, Error>) => {
	return useQuery({
		queryKey: ["quizz-questions", id],
		queryFn: () => quizzQuestionService.getById(id),
		...options,
	});
};

export const useGetQuestionAnswer = (userId: string, quizzQuestionId: string, options?: UseQueryOptions<QuestionAnswerInfoDto, Error>) => {
	return useQuery({
		queryKey: ["question-answers", userId, quizzQuestionId],
		queryFn: () => quizzQuestionService.getAnswer(userId, quizzQuestionId),
		...options,
	});
};

export const useCreateQuizzQuestion = (options?: UseMutationOptions<QuizzQuestionInfoDto, Error, CreateQuizzQuestionDto>) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationFn: (params: CreateQuizzQuestionDto) => quizzQuestionService.create(params),
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: ["quizz-questions"] });
			options?.onSuccess?.(...args);
		},
	});
};

export const useUpdateQuizzQuestion = (options?: UseMutationOptions<QuizzQuestionInfoDto, Error, { id: string; params: UpdateQuizzQuestionDto }>) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationFn: ({ id, params }) => quizzQuestionService.update(id, params),
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: ["quizz-questions"] });
			options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteQuizzQuestion = (options?: UseMutationOptions<void, Error, string>) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationFn: (id: string) => quizzQuestionService.delete(id),
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: ["quizz-questions"] });
			options?.onSuccess?.(...args);
		},
	});
};

export const useParticipateQuizzQuestion = (options?: UseMutationOptions<void, Error, { id: string; userId: string; params: CreateQuestionAnswerDto }>) => {
	return useMutation({
		mutationFn: ({ id, userId, params }) => quizzQuestionService.participate(id, userId, params),
		...options,
	});
};
