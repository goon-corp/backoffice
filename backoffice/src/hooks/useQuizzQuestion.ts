import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { quizzQuestionService } from "../Services/quizzQuestionService";
import type { CreateQuizzQuestionDto, UpdateQuizzQuestionDto, CreateQuestionAnswerDto, QuizzQuestionInfoDto, QuestionAnswerInfoDto } from "../Types/QuizzQuestionTypes";

export const useGetQuizzQuestions = (options?: UseQueryOptions<QuizzQuestionInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["quizz-questions"],
		queryFn: () => quizzQuestionService.getAll(),
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
	return useMutation({
		mutationFn: (params: CreateQuizzQuestionDto) => quizzQuestionService.create(params),
		...options,
	});
};

export const useUpdateQuizzQuestion = (options?: UseMutationOptions<QuizzQuestionInfoDto, Error, { id: string; params: UpdateQuizzQuestionDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => quizzQuestionService.update(id, params),
		...options,
	});
};

export const useDeleteQuizzQuestion = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => quizzQuestionService.delete(id),
		...options,
	});
};

export const useParticipateQuizzQuestion = (options?: UseMutationOptions<void, Error, { id: string; userId: string; params: CreateQuestionAnswerDto }>) => {
	return useMutation({
		mutationFn: ({ id, userId, params }) => quizzQuestionService.participate(id, userId, params),
		...options,
	});
};
