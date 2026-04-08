import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { eventService } from "../Services/eventService";
import type { UpdateEventDto, ReturnEventDto, ReturnEventMemberDto, GetEventMembersParams } from "../Types/EventTypes";

export const useGetEventByRessource = (ressourceId: string, options?: UseQueryOptions<ReturnEventDto, Error>) => {
	return useQuery({
		queryKey: ["events", ressourceId],
		queryFn: () => eventService.getByRessource(ressourceId),
		...options,
	});
};

export const useGetEventMembers = (eventId: string, params?: GetEventMembersParams, options?: UseQueryOptions<ReturnEventMemberDto[], Error>) => {
	return useQuery({
		queryKey: ["events", eventId, "members", params],
		queryFn: () => eventService.getMembers(eventId, params),
		...options,
	});
};

export const useCreateEvent = (options?: UseMutationOptions<ReturnEventDto, Error, FormData>) => {
	return useMutation({
		mutationFn: (formData: FormData) => eventService.create(formData),
		...options,
	});
};

export const useUpdateEvent = (options?: UseMutationOptions<ReturnEventDto, Error, { eventId: string; params: UpdateEventDto }>) => {
	return useMutation({
		mutationFn: ({ eventId, params }) => eventService.update(eventId, params),
		...options,
	});
};

export const useDeleteEvent = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (eventId: string) => eventService.delete(eventId),
		...options,
	});
};

export const useAddEventMember = (options?: UseMutationOptions<void, Error, { eventId: string; userId: string }>) => {
	return useMutation({
		mutationFn: ({ eventId, userId }) => eventService.addMember(eventId, userId),
		...options,
	});
};

export const useRemoveEventMember = (options?: UseMutationOptions<void, Error, { eventId: string; userId: string }>) => {
	return useMutation({
		mutationFn: ({ eventId, userId }) => eventService.removeMember(eventId, userId),
		...options,
	});
};

export const useJoinEvent = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (eventId: string) => eventService.join(eventId),
		...options,
	});
};

export const useLeaveEvent = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (eventId: string) => eventService.leave(eventId),
		...options,
	});
};
