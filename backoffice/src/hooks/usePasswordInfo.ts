import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { passwordInfoService } from "../Services/passwordInfoService";
import type { PasswordInfo, CreatePasswordInfoDto, UpdatePasswordInfoDto } from "../Types/PasswordInfoTypes";

export const useGetPasswordInfos = (options?: UseQueryOptions<PasswordInfo[], Error>) => {
	return useQuery({
		queryKey: ["password-infos"],
		queryFn: () => passwordInfoService.getAll(),
		...options,
	});
};

export const useGetPasswordInfo = (id: string, options?: UseQueryOptions<PasswordInfo, Error>) => {
	return useQuery({
		queryKey: ["password-infos", id],
		queryFn: () => passwordInfoService.getById(id),
		...options,
	});
};

export const useCreatePasswordInfo = (options?: UseMutationOptions<PasswordInfo, Error, CreatePasswordInfoDto>) => {
	return useMutation({
		mutationFn: (params: CreatePasswordInfoDto) => passwordInfoService.create(params),
		...options,
	});
};

export const useUpdatePasswordInfo = (options?: UseMutationOptions<PasswordInfo, Error, { id: string; params: UpdatePasswordInfoDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => passwordInfoService.update(id, params),
		...options,
	});
};

export const useDeletePasswordInfo = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => passwordInfoService.delete(id),
		...options,
	});
};
