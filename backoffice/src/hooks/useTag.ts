import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { tagService } from "../Services/tagService";
import type { Tag, CreateTagDto, UpdateTagDto } from "../Types/TagTypes";

export const useGetTags = (options?: UseQueryOptions<Tag[], Error>) => {
	return useQuery({
		queryKey: ["tags"],
		queryFn: () => tagService.getAll(),
		...options,
	});
};

export const useGetTag = (id: string, options?: UseQueryOptions<Tag, Error>) => {
	return useQuery({
		queryKey: ["tags", id],
		queryFn: () => tagService.getById(id),
		...options,
	});
};

export const useCreateTag = (options?: UseMutationOptions<Tag, Error, CreateTagDto>) => {
	return useMutation({
		mutationFn: (params: CreateTagDto) => tagService.create(params),
		...options,
	});
};

export const useUpdateTag = (options?: UseMutationOptions<Tag, Error, { id: string; params: UpdateTagDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => tagService.update(id, params),
		...options,
	});
};

export const useDeleteTag = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => tagService.delete(id),
		...options,
	});
};
