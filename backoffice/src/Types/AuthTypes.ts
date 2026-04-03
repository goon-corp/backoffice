export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
};

export type AuthResultDto = {
  access_token: string;
  refresh_token: string;
};

export type RefreshTokenDto = {
  refresh_token: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  new_password: string;
  confirm_password: string;
};

export type ChangePasswordDto = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
