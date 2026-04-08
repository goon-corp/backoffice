import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { pollOptionService } from "../Services/pollOptionService";
import type { CreatePollOptionDto, UpdatePollOptionDto, PollOptionInfoDto } from "../Types/PollOptionTypes";
import type { PaginatedResponse } from "../Types/PaginatedResponse";

export const useGetPollOptions = (options?: UseQueryOptions<PaginatedResponse<PollOptionInfoDto>, Error>) => {
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
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationFn: (params: CreatePollOptionDto) => pollOptionService.create(params),
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: ["poll-options"] });
			options?.onSuccess?.(...args);
		},
	});
};

export const useUpdatePollOption = (options?: UseMutationOptions<PollOptionInfoDto, Error, { id: string; params: UpdatePollOptionDto }>) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationFn: ({ id, params }) => pollOptionService.update(id, params),
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: ["poll-options"] });
			options?.onSuccess?.(...args);
		},
	});
};

export const useDeletePollOption = (options?: UseMutationOptions<void, Error, string>) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationFn: (id: string) => pollOptionService.delete(id),
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: ["poll-options"] });
			options?.onSuccess?.(...args);
		},
	});
};
