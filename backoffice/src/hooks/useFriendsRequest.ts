import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { friendsRequestService } from "../Services/friendsRequestService";
import type { CreateFriendsRequestDto, UpdateFriendsRequestDto, FriendsRequestInfoDto, GetFriendsRequestsParams } from "../Types/FriendsRequestTypes";

export const useGetFriendsRequests = (params?: GetFriendsRequestsParams, options?: UseQueryOptions<FriendsRequestInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["friends-requests", params],
		queryFn: () => friendsRequestService.getAll(params),
		...options,
	});
};

export const useGetFriendsRequest = (userSenderId: string, userReceiverId: string, options?: UseQueryOptions<FriendsRequestInfoDto, Error>) => {
	return useQuery({
		queryKey: ["friends-requests", userSenderId, userReceiverId],
		queryFn: () => friendsRequestService.getById(userSenderId, userReceiverId),
		...options,
	});
};

export const useCreateFriendsRequest = (options?: UseMutationOptions<FriendsRequestInfoDto, Error, CreateFriendsRequestDto>) => {
	return useMutation({
		mutationFn: (params: CreateFriendsRequestDto) => friendsRequestService.create(params),
		...options,
	});
};

export const useUpdateFriendsRequest = (options?: UseMutationOptions<FriendsRequestInfoDto, Error, { userSenderId: string; userReceiverId: string; params: UpdateFriendsRequestDto }>) => {
	return useMutation({
		mutationFn: ({ userSenderId, userReceiverId, params }) => friendsRequestService.update(userSenderId, userReceiverId, params),
		...options,
	});
};

export const useDeleteFriendsRequest = (options?: UseMutationOptions<void, Error, { userSenderId: string; userReceiverId: string }>) => {
	return useMutation({
		mutationFn: ({ userSenderId, userReceiverId }) => friendsRequestService.delete(userSenderId, userReceiverId),
		...options,
	});
};
