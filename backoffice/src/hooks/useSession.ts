import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { sessionService } from "../Services/sessionService";
import type { Session, CreateSessionDto, UpdateSessionDto } from "../Types/SessionTypes";

export const useGetSessions = (options?: UseQueryOptions<Session[], Error>) => {
	return useQuery({
		queryKey: ["sessions"],
		queryFn: () => sessionService.getAll(),
		...options,
	});
};

export const useGetSession = (id: string, options?: UseQueryOptions<Session, Error>) => {
	return useQuery({
		queryKey: ["sessions", id],
		queryFn: () => sessionService.getById(id),
		...options,
	});
};

export const useCreateSession = (options?: UseMutationOptions<Session, Error, CreateSessionDto>) => {
	return useMutation({
		mutationFn: (params: CreateSessionDto) => sessionService.create(params),
		...options,
	});
};

export const useUpdateSession = (options?: UseMutationOptions<Session, Error, { id: string; params: UpdateSessionDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => sessionService.update(id, params),
		...options,
	});
};

export const useDeleteSession = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => sessionService.delete(id),
		...options,
	});
};
