export const env = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
	apiVersion: import.meta.env.VITE_API_VERSION,
	nodeEnv: import.meta.env.VITE_NODE_ENV,
	reactAppEnv: import.meta.env.REACT_APP_ENV,
	apiKey: import.meta.env.VITE_API_KEY,
} as const;

if (!env.apiBaseUrl) {
	throw new Error("VITE_API_BASE_URL is not defined");
}
