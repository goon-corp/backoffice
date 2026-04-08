export type CreateUserRoleDto = Record<string, unknown>;
export type UpdateUserRoleDto = Record<string, unknown>;
export type UserRole = {
  id: string;
  update_time: string | null;
  deletion_time: string | null;
  creation_time: string;
  role_label: string | null;
};
