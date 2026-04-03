import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { reportTypeService } from "../Services/reportTypeService";
import type { ReportType, CreateReportTypeDto, UpdateReportTypeDto } from "../Types/ReportTypeTypes";

export const useGetReportTypes = (options?: UseQueryOptions<ReportType[], Error>) => {
	return useQuery({
		queryKey: ["report-types"],
		queryFn: () => reportTypeService.getAll(),
		...options,
	});
};

export const useGetReportType = (id: string, options?: UseQueryOptions<ReportType, Error>) => {
	return useQuery({
		queryKey: ["report-types", id],
		queryFn: () => reportTypeService.getById(id),
		...options,
	});
};

export const useCreateReportType = (options?: UseMutationOptions<ReportType, Error, CreateReportTypeDto>) => {
	return useMutation({
		mutationFn: (params: CreateReportTypeDto) => reportTypeService.create(params),
		...options,
	});
};

export const useUpdateReportType = (options?: UseMutationOptions<ReportType, Error, { id: string; params: UpdateReportTypeDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => reportTypeService.update(id, params),
		...options,
	});
};

export const useDeleteReportType = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => reportTypeService.delete(id),
		...options,
	});
};
