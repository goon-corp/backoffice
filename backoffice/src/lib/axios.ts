import axios from "axios";
import { env } from "./env";

export const api = axios.create({
	baseURL: `${env.apiBaseUrl}`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		"x-api-key": env.apiKey,
	},
});

const getSessionToken = (): string | undefined => {
	return document.cookie
		.split("; ")
		.find((row) => row.startsWith("sessionToken="))
		?.split("=")[1];
};

api.interceptors.request.use(
	function (config) {
		const token = getSessionToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
	{
		synchronous: true,
		runWhen: () => !!getSessionToken(),
	},
);
