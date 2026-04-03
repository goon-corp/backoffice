import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { backofficeOperationTypeService } from "../Services/backofficeOperationTypeService";
import type { BackofficeOperationType, CreateBackofficeOperationTypeDto, UpdateBackofficeOperationTypeDto } from "../Types/BackofficeOperationTypeTypes";

export const useGetBackofficeOperationTypes = (options?: UseQueryOptions<BackofficeOperationType[], Error>) => {
	return useQuery({
		queryKey: ["backoffice-operation-types"],
		queryFn: () => backofficeOperationTypeService.getAll(),
		...options,
	});
};

export const useGetBackofficeOperationType = (id: number, options?: UseQueryOptions<BackofficeOperationType, Error>) => {
	return useQuery({
		queryKey: ["backoffice-operation-types", id],
		queryFn: () => backofficeOperationTypeService.getById(id),
		...options,
	});
};

export const useCreateBackofficeOperationType = (options?: UseMutationOptions<BackofficeOperationType, Error, CreateBackofficeOperationTypeDto>) => {
	return useMutation({
		mutationFn: (params: CreateBackofficeOperationTypeDto) => backofficeOperationTypeService.create(params),
		...options,
	});
};

export const useUpdateBackofficeOperationType = (options?: UseMutationOptions<BackofficeOperationType, Error, { id: number; params: UpdateBackofficeOperationTypeDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => backofficeOperationTypeService.update(id, params),
		...options,
	});
};

export const useDeleteBackofficeOperationType = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => backofficeOperationTypeService.delete(id),
		...options,
	});
};
