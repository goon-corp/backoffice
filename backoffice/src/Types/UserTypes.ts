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

export type UserInfoDto = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
  is_active: boolean;
  user_role_id: string;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
};

export type UserProfileDto = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
  email: string | null;
  authored_ressources_count: number;
  liked_ressources_count: number;
  favorite_ressources_count: number;
};

export type CreateUserDto = {
  first_name?: string | null;
  last_name?: string | null;
  user_name?: string | null;
  user_role_id?: string;
};

export type UpdateUserDto = {
  first_name?: string | null;
  last_name?: string | null;
  user_name?: string | null;
  is_active?: boolean;
  creation_time?: string;
  update_time?: string | null;
  deletion_time?: string | null;
  user_role_id?: string;
};
