import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { loginService } from "../Services/loginService";
import type { Login, CreateLoginDto, UpdateLoginDto } from "../Types/LoginTypes";

export const useGetLogins = (options?: UseQueryOptions<Login[], Error>) => {
	return useQuery({
		queryKey: ["logins"],
		queryFn: () => loginService.getAll(),
		...options,
	});
};

export const useGetLogin = (id: number, options?: UseQueryOptions<Login, Error>) => {
	return useQuery({
		queryKey: ["logins", id],
		queryFn: () => loginService.getById(id),
		...options,
	});
};

export const useCreateLogin = (options?: UseMutationOptions<Login, Error, CreateLoginDto>) => {
	return useMutation({
		mutationFn: (params: CreateLoginDto) => loginService.create(params),
		...options,
	});
};

export const useUpdateLogin = (options?: UseMutationOptions<Login, Error, { id: number; params: UpdateLoginDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => loginService.update(id, params),
		...options,
	});
};

export const useDeleteLogin = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => loginService.delete(id),
		...options,
	});
};
