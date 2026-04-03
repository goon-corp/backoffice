import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { authService } from "../Services/authService";
import type {
	LoginDto,
	RegisterDto,
	AuthResultDto,
	RefreshTokenDto,
	ForgotPasswordDto,
	ResetPasswordDto,
	ChangePasswordDto,
} from "../Types/AuthTypes";

export const useLogin = (options?: UseMutationOptions<AuthResultDto, Error, { client: string; params: LoginDto }>) => {
	return useMutation({
		mutationFn: ({ client, params }) => authService.login(client, params),
		...options,
	});
};

export const useRegister = (options?: UseMutationOptions<void, Error, RegisterDto>) => {
	return useMutation({
		mutationFn: (params: RegisterDto) => authService.register(params),
		...options,
	});
};

export const useConfirmAccount = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation({
		mutationFn: (token: string) => authService.confirmAccount(token),
		...options,
	});
};

export const useForgotPassword = (options?: UseMutationOptions<void, Error, ForgotPasswordDto>) => {
	return useMutation({
		mutationFn: (params: ForgotPasswordDto) => authService.forgotPassword(params),
		...options,
	});
};

export const useResetPassword = (options?: UseMutationOptions<void, Error, ResetPasswordDto>) => {
	return useMutation({
		mutationFn: (params: ResetPasswordDto) => authService.resetPassword(params),
		...options,
	});
};

export const useRefreshToken = (options?: UseMutationOptions<AuthResultDto, Error, RefreshTokenDto>) => {
	return useMutation({
		mutationFn: (params: RefreshTokenDto) => authService.refreshToken(params),
		...options,
	});
};

export const useLogout = (options?: UseMutationOptions<void, Error, RefreshTokenDto>) => {
	return useMutation({
		mutationFn: (params: RefreshTokenDto) => authService.logout(params),
		...options,
	});
};

export const useChangePassword = (options?: UseMutationOptions<void, Error, { refreshToken: string; params: ChangePasswordDto }>) => {
	return useMutation({
		mutationFn: ({ refreshToken, params }) => authService.changePassword(refreshToken, params),
		...options,
	});
};
