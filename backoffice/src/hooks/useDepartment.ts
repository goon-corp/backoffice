import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { departmentService } from "../Services/departmentService";
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../Types/DepartmentTypes";

export const useGetDepartments = (options?: UseQueryOptions<Department[], Error>) => {
	return useQuery({
		queryKey: ["departments"],
		queryFn: () => departmentService.getAll(),
		...options,
	});
};

export const useGetDepartment = (id: number, options?: UseQueryOptions<Department, Error>) => {
	return useQuery({
		queryKey: ["departments", id],
		queryFn: () => departmentService.getById(id),
		...options,
	});
};

export const useCreateDepartment = (options?: UseMutationOptions<Department, Error, CreateDepartmentDto>) => {
	return useMutation({
		mutationFn: (params: CreateDepartmentDto) => departmentService.create(params),
		...options,
	});
};

export const useUpdateDepartment = (options?: UseMutationOptions<Department, Error, { id: number; params: UpdateDepartmentDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => departmentService.update(id, params),
		...options,
	});
};

export const useDeleteDepartment = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => departmentService.delete(id),
		...options,
	});
};
