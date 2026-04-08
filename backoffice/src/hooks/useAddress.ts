import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { addressService } from "../Services/addressService";
import type { Address, CreateAddressDto, UpdateAddressDto } from "../Types/AddressTypes";

export const useGetAddresses = (options?: UseQueryOptions<Address[], Error>) => {
	return useQuery({
		queryKey: ["addresses"],
		queryFn: () => addressService.getAll(),
		...options,
	});
};

export const useGetAddress = (id: number, options?: UseQueryOptions<Address, Error>) => {
	return useQuery({
		queryKey: ["addresses", id],
		queryFn: () => addressService.getById(id),
		...options,
	});
};

export const useCreateAddress = (options?: UseMutationOptions<Address, Error, CreateAddressDto>) => {
	return useMutation({
		mutationFn: (params: CreateAddressDto) => addressService.create(params),
		...options,
	});
};

export const useUpdateAddress = (options?: UseMutationOptions<Address, Error, { id: number; params: UpdateAddressDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => addressService.update(id, params),
		...options,
	});
};

export const useDeleteAddress = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => addressService.delete(id),
		...options,
	});
};
