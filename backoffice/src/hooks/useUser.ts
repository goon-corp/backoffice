import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { userService } from "../Services/userService";
import type { User, CreateUserDto, UpdateUserDto } from "../Types/UserTypes";

export const useGetUsers = (options?: UseQueryOptions<User[], Error>) => {
	return useQuery({
		queryKey: ["users"],
		queryFn: () => userService.getAll(),
		...options,
	});
};

export const useGetUser = (id: string, options?: UseQueryOptions<User, Error>) => {
	return useQuery({
		queryKey: ["users", id],
		queryFn: () => userService.getById(id),
		...options,
	});
};

export const useGetUserProfile = (id: string, options?: UseQueryOptions<User, Error>) => {
	return useQuery({
		queryKey: ["users", id, "profile"],
		queryFn: () => userService.getProfile(id),
		...options,
	});
};

export const useCreateUser = (options?: UseMutationOptions<User, Error, CreateUserDto>) => {
	return useMutation({
		mutationFn: (params: CreateUserDto) => userService.create(params),
		...options,
	});
};

export const useUpdateUser = (options?: UseMutationOptions<User, Error, { id: string; params: UpdateUserDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => userService.update(id, params),
		...options,
	});
};

export const useDeleteUser = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => userService.delete(id),
		...options,
	});
};
