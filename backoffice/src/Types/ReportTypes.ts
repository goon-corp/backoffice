export type CreateReportDto = {
  report_type_id: string;
  ressource_id: string;
};

export type UpdateReportDto = {
  is_checked_by_moderator: boolean;
};

export type ReportInfoDto = {
  id: string;
  report_type_id: string;
  user_id: string;
  ressource_id: string;
  is_checked_by_moderator: boolean;
  creation_time: string;
  update_time: string | null;
};
