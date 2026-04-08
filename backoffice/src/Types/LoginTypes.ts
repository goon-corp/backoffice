export type CreateLoginDto = {
  email: string;
  password_hash: string;
  password_salt: string;
  user_id: string;
};

export type UpdateLoginDto = Record<string, unknown>;
export type Login = {
  id: string;
  email: string | null;
  password_hash: string | null;
  creation_time: string;
  update_time: string | null;
  deletion_time: string | null;
  user_id: string;
};
