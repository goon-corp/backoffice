import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { userRoleService } from "../Services/userRoleService";
import type { UserRole, CreateUserRoleDto, UpdateUserRoleDto } from "../Types/UserRoleTypes";

export const useGetUserRoles = (options?: UseQueryOptions<UserRole[], Error>) => {
	return useQuery({
		queryKey: ["user-roles"],
		queryFn: () => userRoleService.getAll(),
		...options,
	});
};

export const useGetUserRole = (id: string, options?: UseQueryOptions<UserRole, Error>) => {
	return useQuery({
		queryKey: ["user-roles", id],
		queryFn: () => userRoleService.getById(id),
		...options,
	});
};

export const useCreateUserRole = (options?: UseMutationOptions<UserRole, Error, CreateUserRoleDto>) => {
	return useMutation({
		mutationFn: (params: CreateUserRoleDto) => userRoleService.create(params),
		...options,
	});
};

export const useUpdateUserRole = (options?: UseMutationOptions<UserRole, Error, { id: string; params: UpdateUserRoleDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => userRoleService.update(id, params),
		...options,
	});
};

export const useDeleteUserRole = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => userRoleService.delete(id),
		...options,
	});
};
