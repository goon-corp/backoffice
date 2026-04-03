import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { notificationService } from "../Services/notificationService";
import type { Notification, CreateNotificationDto, UpdateNotificationDto } from "../Types/NotificationTypes";

export const useGetNotifications = (options?: UseQueryOptions<Notification[], Error>) => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: () => notificationService.getAll(),
		...options,
	});
};

export const useGetNotification = (id: number, options?: UseQueryOptions<Notification, Error>) => {
	return useQuery({
		queryKey: ["notifications", id],
		queryFn: () => notificationService.getById(id),
		...options,
	});
};

export const useCreateNotification = (options?: UseMutationOptions<Notification, Error, CreateNotificationDto>) => {
	return useMutation({
		mutationFn: (params: CreateNotificationDto) => notificationService.create(params),
		...options,
	});
};

export const useUpdateNotification = (options?: UseMutationOptions<Notification, Error, { id: number; params: UpdateNotificationDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => notificationService.update(id, params),
		...options,
	});
};

export const useDeleteNotification = (options?: UseMutationOptions<void, Error, number>) => {
	return useMutation({
		mutationFn: (id: number) => notificationService.delete(id),
		...options,
	});
};
