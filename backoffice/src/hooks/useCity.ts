import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { cityService } from "../Services/cityService";
import type { City, CreateCityDto, UpdateCityDto } from "../Types/CityTypes";

export const useGetCities = (options?: UseQueryOptions<City[], Error>) => {
	return useQuery({
		queryKey: ["cities"],
		queryFn: () => cityService.getAll(),
		...options,
	});
};

export const useGetCity = (id: number, options?: UseQueryOptions<City, Error>) => {
	return useQuery({
		queryKey: ["cities", id],
		queryFn: () => cityService.getById(id),
		...options,
	});
};

export const useCreateCity = (options?: UseMutationOptions<City, Error, CreateCityDto>) => {
	return useMutation({
		mutationFn: (params: CreateCityDto) => cityService.create(params),
		...options,
	});
};

export const useUpdateCity = (options?: UseMutationOptions<City, Error, { id: number; params: UpdateCityDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => cityService.update(id, params),
		...options,
	});
};

export const useDeleteCity = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => cityService.delete(id),
		...options,
	});
};
