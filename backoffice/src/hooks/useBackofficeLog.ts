import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { backofficeLogService } from "../Services/backofficeLogService";
import type { BackofficeLog, CreateBackofficeLogDto, UpdateBackofficeLogDto } from "../Types/BackofficeLogTypes";

export const useGetBackofficeLogs = (options?: UseQueryOptions<BackofficeLog[], Error>) => {
	return useQuery({
		queryKey: ["backoffice-logs"],
		queryFn: () => backofficeLogService.getAll(),
		...options,
	});
};

export const useGetBackofficeLog = (id: number, options?: UseQueryOptions<BackofficeLog, Error>) => {
	return useQuery({
		queryKey: ["backoffice-logs", id],
		queryFn: () => backofficeLogService.getById(id),
		...options,
	});
};

export const useCreateBackofficeLog = (options?: UseMutationOptions<BackofficeLog, Error, CreateBackofficeLogDto>) => {
	return useMutation({
		mutationFn: (params: CreateBackofficeLogDto) => backofficeLogService.create(params),
		...options,
	});
};

export const useUpdateBackofficeLog = (options?: UseMutationOptions<BackofficeLog, Error, { id: number; params: UpdateBackofficeLogDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => backofficeLogService.update(id, params),
		...options,
	});
};

export const useDeleteBackofficeLog = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => backofficeLogService.delete(id),
		...options,
	});
};
