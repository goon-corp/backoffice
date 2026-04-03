import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { emailLogService } from "../Services/emailLogService";
import type { EmailLog } from "../Types/EmailLogTypes";

export const useGetEmailLogs = (options?: UseQueryOptions<EmailLog[], Error>) => {
	return useQuery({
		queryKey: ["email-logs"],
		queryFn: () => emailLogService.getAll(),
		...options,
	});
};

export const useGetEmailLog = (id: number, options?: UseQueryOptions<EmailLog, Error>) => {
	return useQuery({
		queryKey: ["email-logs", id],
		queryFn: () => emailLogService.getById(id),
		...options,
	});
};
