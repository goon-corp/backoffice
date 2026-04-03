export type CreateBackofficeLogDto = Record<string, unknown>;
export type UpdateBackofficeLogDto = Record<string, unknown>;
export type BackofficeLog = {
  id: string;
  event_time: string;
  log_content: string | null;
  backoffice_log_level_id: string;
  backoffice_operation_type_id: string;
};
