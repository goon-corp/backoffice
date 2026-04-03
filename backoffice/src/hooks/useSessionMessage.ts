import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { sessionMessageService } from "../Services/sessionMessageService";
import type { SessionMessage, CreateSessionMessageDto, UpdateSessionMessageDto } from "../Types/SessionMessageTypes";

export const useGetSessionMessages = (options?: UseQueryOptions<SessionMessage[], Error>) => {
	return useQuery({
		queryKey: ["session-messages"],
		queryFn: () => sessionMessageService.getAll(),
		...options,
	});
};

export const useGetSessionMessage = (id: string, options?: UseQueryOptions<SessionMessage, Error>) => {
	return useQuery({
		queryKey: ["session-messages", id],
		queryFn: () => sessionMessageService.getById(id),
		...options,
	});
};

export const useCreateSessionMessage = (options?: UseMutationOptions<SessionMessage, Error, CreateSessionMessageDto>) => {
	return useMutation({
		mutationFn: (params: CreateSessionMessageDto) => sessionMessageService.create(params),
		...options,
	});
};

export const useUpdateSessionMessage = (options?: UseMutationOptions<SessionMessage, Error, { id: string; params: UpdateSessionMessageDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => sessionMessageService.update(id, params),
		...options,
	});
};

export const useDeleteSessionMessage = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => sessionMessageService.delete(id),
		...options,
	});
};
