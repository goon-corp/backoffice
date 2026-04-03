import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { ressourceProgressionService } from "../Services/ressourceProgressionService";
import type { RessourceProgression, CreateRessourceProgressionDto, UpdateRessourceProgressionDto } from "../Types/RessourceProgressionTypes";

export const useGetRessourceProgressions = (options?: UseQueryOptions<RessourceProgression[], Error>) => {
	return useQuery({
		queryKey: ["ressource-progressions"],
		queryFn: () => ressourceProgressionService.getAll(),
		...options,
	});
};

export const useGetRessourceProgression = (id: string, options?: UseQueryOptions<RessourceProgression, Error>) => {
	return useQuery({
		queryKey: ["ressource-progressions", id],
		queryFn: () => ressourceProgressionService.getById(id),
		...options,
	});
};

export const useCreateRessourceProgression = (options?: UseMutationOptions<RessourceProgression, Error, CreateRessourceProgressionDto>) => {
	return useMutation({
		mutationFn: (params: CreateRessourceProgressionDto) => ressourceProgressionService.create(params),
		...options,
	});
};

export const useUpdateRessourceProgression = (options?: UseMutationOptions<RessourceProgression, Error, { id: string; params: UpdateRessourceProgressionDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => ressourceProgressionService.update(id, params),
		...options,
	});
};

export const useDeleteRessourceProgression = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => ressourceProgressionService.delete(id),
		...options,
	});
};
