export type CreateUserDto = Record<string, unknown>;
export type UpdateUserDto = Record<string, unknown>;
export type User = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
  is_active: boolean;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
  user_role_id: string;
};
