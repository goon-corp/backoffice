import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { regionService } from "../Services/regionService";
import type { Region, CreateRegionDto, UpdateRegionDto } from "../Types/RegionTypes";

export const useGetRegions = (options?: UseQueryOptions<Region[], Error>) => {
	return useQuery({
		queryKey: ["regions"],
		queryFn: () => regionService.getAll(),
		...options,
	});
};

export const useGetRegion = (id: number, options?: UseQueryOptions<Region, Error>) => {
	return useQuery({
		queryKey: ["regions", id],
		queryFn: () => regionService.getById(id),
		...options,
	});
};

export const useCreateRegion = (options?: UseMutationOptions<Region, Error, CreateRegionDto>) => {
	return useMutation({
		mutationFn: (params: CreateRegionDto) => regionService.create(params),
		...options,
	});
};

export const useUpdateRegion = (options?: UseMutationOptions<Region, Error, { id: number; params: UpdateRegionDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => regionService.update(id, params),
		...options,
	});
};

export const useDeleteRegion = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => regionService.delete(id),
		...options,
	});
};
