import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { commentService } from "../Services/commentService";
import type { Comment, CreateCommentDto, UpdateCommentDto } from "../Types/CommentTypes";

export const useGetComments = (options?: UseQueryOptions<Comment[], Error>) => {
	return useQuery({
		queryKey: ["comments"],
		queryFn: () => commentService.getAll(),
		...options,
	});
};

export const useGetComment = (id: string, options?: UseQueryOptions<Comment, Error>) => {
	return useQuery({
		queryKey: ["comments", id],
		queryFn: () => commentService.getById(id),
		...options,
	});
};

export const useCreateComment = (options?: UseMutationOptions<Comment, Error, CreateCommentDto>) => {
	return useMutation({
		mutationFn: (params: CreateCommentDto) => commentService.create(params),
		...options,
	});
};

export const useUpdateComment = (options?: UseMutationOptions<Comment, Error, { id: string; params: UpdateCommentDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => commentService.update(id, params),
		...options,
	});
};

export const useDeleteComment = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => commentService.delete(id),
		...options,
	});
};
