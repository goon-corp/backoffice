export type CreatePasswordInfoDto = {
  user_id: string;
  attempt_count?: number;
};

export type UpdatePasswordInfoDto = Record<string, unknown>;
export type PasswordInfo = {
  id: string;
  update_time: string | null;
  deletion_time: string | null;
  creation_time: string;
  attempt_count: number;
  reset_token: string | null;
  reset_date: string | null;
  user_id: string;
};
