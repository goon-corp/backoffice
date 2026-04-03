import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { profilePictureService } from "../Services/profilePictureService";
import type { ProfilePicture, CreateProfilePictureDto, UpdateProfilePictureDto } from "../Types/ProfilePictureTypes";

export const useGetProfilePictures = (options?: UseQueryOptions<ProfilePicture[], Error>) => {
	return useQuery({
		queryKey: ["profile-pictures"],
		queryFn: () => profilePictureService.getAll(),
		...options,
	});
};

export const useGetProfilePicture = (id: string, options?: UseQueryOptions<ProfilePicture, Error>) => {
	return useQuery({
		queryKey: ["profile-pictures", id],
		queryFn: () => profilePictureService.getById(id),
		...options,
	});
};

export const useCreateProfilePicture = (options?: UseMutationOptions<ProfilePicture, Error, CreateProfilePictureDto>) => {
	return useMutation({
		mutationFn: (params: CreateProfilePictureDto) => profilePictureService.create(params),
		...options,
	});
};

export const useUpdateProfilePicture = (options?: UseMutationOptions<ProfilePicture, Error, { id: string; params: UpdateProfilePictureDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => profilePictureService.update(id, params),
		...options,
	});
};

export const useDeleteProfilePicture = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => profilePictureService.delete(id),
		...options,
	});
};
