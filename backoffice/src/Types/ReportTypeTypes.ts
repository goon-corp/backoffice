export type CreateReportTypeDto = Record<string, unknown>;
export type UpdateReportTypeDto = Record<string, unknown>;
export type ReportType = {
  id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
  label: string | null;
};
