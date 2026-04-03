import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { backofficeLogLevelService } from "../Services/backofficeLogLevelService";
import type { BackofficeLogLevel, CreateBackofficeLogLevelDto, UpdateBackofficeLogLevelDto } from "../Types/BackofficeLogLevelTypes";

export const useGetBackofficeLogLevels = (options?: UseQueryOptions<BackofficeLogLevel[], Error>) => {
	return useQuery({
		queryKey: ["backoffice-log-levels"],
		queryFn: () => backofficeLogLevelService.getAll(),
		...options,
	});
};

export const useGetBackofficeLogLevel = (id: number, options?: UseQueryOptions<BackofficeLogLevel, Error>) => {
	return useQuery({
		queryKey: ["backoffice-log-levels", id],
		queryFn: () => backofficeLogLevelService.getById(id),
		...options,
	});
};

export const useCreateBackofficeLogLevel = (options?: UseMutationOptions<BackofficeLogLevel, Error, CreateBackofficeLogLevelDto>) => {
	return useMutation({
		mutationFn: (params: CreateBackofficeLogLevelDto) => backofficeLogLevelService.create(params),
		...options,
	});
};

export const useUpdateBackofficeLogLevel = (options?: UseMutationOptions<BackofficeLogLevel, Error, { id: number; params: UpdateBackofficeLogLevelDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => backofficeLogLevelService.update(id, params),
		...options,
	});
};

export const useDeleteBackofficeLogLevel = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => backofficeLogLevelService.delete(id),
		...options,
	});
};
