import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { pollOptionService } from "../Services/pollOptionService";
import type { CreatePollOptionDto, UpdatePollOptionDto, PollOptionInfoDto } from "../Types/PollOptionTypes";

export const useGetPollOptions = (options?: UseQueryOptions<PollOptionInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["poll-options"],
		queryFn: () => pollOptionService.getAll(),
		...options,
	});
};

export const useGetPollOption = (id: string, options?: UseQueryOptions<PollOptionInfoDto, Error>) => {
	return useQuery({
		queryKey: ["poll-options", id],
		queryFn: () => pollOptionService.getById(id),
		...options,
	});
};

export const useCreatePollOption = (options?: UseMutationOptions<PollOptionInfoDto, Error, CreatePollOptionDto>) => {
	return useMutation({
		mutationFn: (params: CreatePollOptionDto) => pollOptionService.create(params),
		...options,
	});
};

export const useUpdatePollOption = (options?: UseMutationOptions<PollOptionInfoDto, Error, { id: string; params: UpdatePollOptionDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => pollOptionService.update(id, params),
		...options,
	});
};

export const useDeletePollOption = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => pollOptionService.delete(id),
		...options,
	});
};
