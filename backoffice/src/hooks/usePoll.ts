import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { pollService } from "../Services/pollService";
import type { UpdatePollDto, CreatePollOptionDto, PollInfoDto } from "../Types/PollTypes";

export const useGetPolls = (options?: UseQueryOptions<PollInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["polls"],
		queryFn: () => pollService.getAll(),
		...options,
	});
};

export const useGetPoll = (id: string, options?: UseQueryOptions<PollInfoDto, Error>) => {
	return useQuery({
		queryKey: ["polls", id],
		queryFn: () => pollService.getById(id),
		...options,
	});
};

export const useGetPollByRessource = (ressourceId: string, options?: UseQueryOptions<PollInfoDto, Error>) => {
	return useQuery({
		queryKey: ["polls", "byRessource", ressourceId],
		queryFn: () => pollService.getByRessource(ressourceId),
		...options,
	});
};

export const useCreatePoll = (options?: UseMutationOptions<PollInfoDto, Error, FormData>) => {
	return useMutation({
		mutationFn: (formData: FormData) => pollService.create(formData),
		...options,
	});
};

export const useUpdatePoll = (options?: UseMutationOptions<PollInfoDto, Error, { id: string; params: UpdatePollDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => pollService.update(id, params),
		...options,
	});
};

export const useDeletePoll = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => pollService.delete(id),
		...options,
	});
};

export const useParticipatePoll = (options?: UseMutationOptions<void, Error, { id: string; params: CreatePollOptionDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => pollService.participate(id, params),
		...options,
	});
};
