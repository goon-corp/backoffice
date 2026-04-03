import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { ressourceService } from "../Services/ressourceService";
import type { ReturnRessourceDto, RessourceStatusInfoDto, RessourceConfidentialityTypeInfoDto, RessourceTypeInfoDto, RessourceMedia, GetRessourcesParams } from "../Types/RessourceTypes";

export const useGetRessources = (params?: GetRessourcesParams, options?: UseQueryOptions<ReturnRessourceDto[], Error>) => {
	return useQuery({
		queryKey: ["ressources", params],
		queryFn: () => ressourceService.getAll(params),
		...options,
	});
};

export const useGetRessourceStatuses = (options?: UseQueryOptions<RessourceStatusInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["ressource-statuses"],
		queryFn: () => ressourceService.getStatuses(),
		...options,
	});
};

export const useGetRessourceTypes = (options?: UseQueryOptions<RessourceTypeInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["ressource-types"],
		queryFn: () => ressourceService.getTypes(),
		...options,
	});
};

export const useGetRessourceConfidentialityTypes = (options?: UseQueryOptions<RessourceConfidentialityTypeInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["ressource-confidentiality-types"],
		queryFn: () => ressourceService.getConfidentialityTypes(),
		...options,
	});
};

export const useGetRessourceMedia = (mediaId: string, options?: UseQueryOptions<RessourceMedia, Error>) => {
	return useQuery({
		queryKey: ["ressource-medias", mediaId],
		queryFn: () => ressourceService.getMedia(mediaId),
		...options,
	});
};

export const useCreateRessource = (options?: UseMutationOptions<ReturnRessourceDto, Error, FormData>) => {
	return useMutation({
		mutationFn: (formData: FormData) => ressourceService.create(formData),
		...options,
	});
};

export const useUploadRessourceMedia = (options?: UseMutationOptions<RessourceMedia, Error, FormData>) => {
	return useMutation({
		mutationFn: (formData: FormData) => ressourceService.uploadMedia(formData),
		...options,
	});
};
