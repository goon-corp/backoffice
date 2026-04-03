import { api } from "../lib/axios";
import type {
	LoginDto,
	RegisterDto,
	AuthResultDto,
	RefreshTokenDto,
	ForgotPasswordDto,
	ResetPasswordDto,
	ChangePasswordDto,
} from "../Types/AuthTypes";

export const authService = {
	login: async (client: string, params: LoginDto): Promise<AuthResultDto> => {
		const response = await api.post(`/api/auth/login/${client}`, params);
		return response.data;
	},

	register: async (params: RegisterDto): Promise<void> => {
		await api.post("/api/auth/register", params);
	},

	confirmAccount: async (token: string): Promise<void> => {
		await api.put(`/api/auth/confirm-account/${token}`);
	},

	forgotPassword: async (params: ForgotPasswordDto): Promise<void> => {
		await api.post("/api/auth/forgot-password", params);
	},

	resetPassword: async (params: ResetPasswordDto): Promise<void> => {
		await api.post("/api/auth/reset-password", params);
	},

	refreshToken: async (params: RefreshTokenDto): Promise<AuthResultDto> => {
		const response = await api.post("/api/auth/refresh-token", params);
		return response.data;
	},

	logout: async (params: RefreshTokenDto): Promise<void> => {
		await api.post("/api/auth/logout", params);
	},

	getToken: async (refreshToken: string): Promise<AuthResultDto> => {
		const response = await api.get("/api/auth/token", {
			headers: { "x-refresh-token": refreshToken },
		});
		return response.data;
	},

	deleteToken: async (
		refreshTokenId: string,
		tokenId: string,
	): Promise<void> => {
		await api.delete(`/api/auth/token/${refreshTokenId}`, {
			params: { tokenId },
		});
	},

	deleteAllTokens: async (refreshToken: string): Promise<void> => {
		await api.delete("/api/auth/tokens", {
			headers: { "x-refresh-token": refreshToken },
		});
	},

	changePassword: async (
		refreshToken: string,
		params: ChangePasswordDto,
	): Promise<void> => {
		await api.post("/api/auth/change-password", params, {
			headers: { "x-refresh-token": refreshToken },
		});
	},
};
