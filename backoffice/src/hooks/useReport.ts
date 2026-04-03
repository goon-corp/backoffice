import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { reportService } from "../Services/reportService";
import type { CreateReportDto, UpdateReportDto, ReportInfoDto } from "../Types/ReportTypes";

export const useGetReports = (options?: UseQueryOptions<ReportInfoDto[], Error>) => {
	return useQuery({
		queryKey: ["reports"],
		queryFn: () => reportService.getAll(),
		...options,
	});
};

export const useGetReport = (id: string, options?: UseQueryOptions<ReportInfoDto, Error>) => {
	return useQuery({
		queryKey: ["reports", id],
		queryFn: () => reportService.getById(id),
		...options,
	});
};

export const useCreateReport = (options?: UseMutationOptions<ReportInfoDto, Error, CreateReportDto>) => {
	return useMutation({
		mutationFn: (params: CreateReportDto) => reportService.create(params),
		...options,
	});
};

export const useUpdateReport = (options?: UseMutationOptions<ReportInfoDto, Error, { id: string; params: UpdateReportDto }>) => {
	return useMutation({
		mutationFn: ({ id, params }) => reportService.update(id, params),
		...options,
	});
};

export const useDeleteReport = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (id: string) => reportService.delete(id),
		...options,
	});
};
