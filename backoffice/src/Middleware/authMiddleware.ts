import { redirect } from "react-router";
import * as jose from "jose";
import { userStore } from "../Store/userStore";

export async function authMiddleware({ request }: { request: Request }) {
	const currentUser = userStore.getState().Userstate;
	const url = new URL(request.url);
	const pathname = url.pathname;

	// Récupération du token depuis le cookie
	const sessionToken = document.cookie
		.split("; ")
		.find((row) => row.startsWith("sessionToken="))
		?.split("=")[1];

	// Redirection si connecté et tente d'accéder au login
	if (pathname === "/login" && currentUser && sessionToken) {
		throw redirect("/");
	}

	// Redirection si pas de token et tente d'accéder à une page protégée
	if (pathname !== "/login" && !sessionToken) {
		throw redirect("/login");
	}

	// Vérification de l'expiration du token
	if (sessionToken) {
		let claims: jose.JWTPayload;

		// 1. Vérification que le token est lisible
		try {
			claims = jose.decodeJwt(sessionToken);
		} catch {
			// Token malformé
			document.cookie =
				"sessionToken=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
			userStore.getState().clearUserConnected();
			throw redirect("/login");
		}

		// 2. Vérification de l'expiration (hors try/catch)
		const now = Math.floor(Date.now() / 1000);
		if (!claims.exp || claims.exp < now) {
			document.cookie =
				"sessionToken=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
			userStore.getState().clearUserConnected();
			throw redirect("/login");
		}
	}

	return null;
}
