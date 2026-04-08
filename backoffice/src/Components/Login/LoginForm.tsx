import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import * as jose from "jose";
import { useLogin } from "../../hooks/useAuth";
import { userStore } from "../../Store/userStore";
import { userService } from "../../Services/userService";
import { userRoleService } from "../../Services/userRoleService";
import type { User, UserInfoDto } from "../../Types/UserTypes";

type Toast = { message: string; type: "error" | "success" };

const LoginForm = () => {
	const navigate = useNavigate();
	const setUserConnected = userStore((s) => s.setUserConnected);

	const [formData, setFormData] = useState({ email: "", password: "" });
	const [toast, setToast] = useState<Toast | null>(null);

	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(() => setToast(null), 4000);
		return () => clearTimeout(timer);
	}, [toast]);

	const loginMutation = useLogin({
		onSuccess: async (data) => {
			const claims = jose.decodeJwt(data.access_token);

			const expires = new Date((claims.exp as number) * 1000).toUTCString();
			document.cookie = `sessionToken=${data.access_token}; Expires=${expires}; Secure; SameSite=Strict`;

			let me: UserInfoDto;
			try {
				const [meResult, roles] = await Promise.all([
					userService.getMe(),
					userRoleService.getAll(),
				]);
				me = meResult;

				const userRole = roles.find((role) => role.id === me.user_role_id);

				if (!userRole || userRole.role_label !== "Administrateur") {
					document.cookie =
						"sessionToken=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
					setToast({ message: "Accès refusé. Ce backoffice est réservé aux administrateurs.", type: "error" });
					return;
				}
			} catch {
				document.cookie =
					"sessionToken=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
				setToast({ message: "Une erreur est survenue lors de la vérification des droits.", type: "error" });
				return;
			}

			const user: User = {
				id: me.id,
				first_name: me.first_name,
				last_name: me.last_name,
				user_name: me.user_name,
				is_active: me.is_active,
				creation_time: me.creation_time,
				update_time: me.update_time,
				deletion_time: me.deletion_time,
				user_role_id: me.user_role_id,
			};

			setUserConnected(user);
			navigate("/");
		},
		onError: () => {
			setToast({ message: "Email ou mot de passe incorrect.", type: "error" });
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		loginMutation.mutate({
			client: "web",
			params: { email: formData.email, password: formData.password },
		});
	};

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
					<h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h1>
					<p className="text-sm text-gray-500 mb-8">
						Accès réservé aux administrateurs.
					</p>

					<form onSubmit={onSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="email"
								className="text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								placeholder="admin@exemple.fr"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="password"
								className="text-sm font-medium text-gray-700"
							>
								Mot de passe
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								placeholder="••••••••"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
						</div>

						<button
							type="submit"
							disabled={loginMutation.isPending}
							className="mt-2 w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
						>
							{loginMutation.isPending ? "Connexion en cours…" : "Se connecter"}
						</button>
					</form>
				</div>
			</div>

			{toast && (
				<div
					className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
						toast.type === "error"
							? "bg-red-50 text-red-700 border border-red-200"
							: "bg-green-50 text-green-700 border border-green-200"
					}`}
				>
					<span>{toast.message}</span>
					<button
						onClick={() => setToast(null)}
						className="ml-2 text-current opacity-50 hover:opacity-100"
					>
						✕
					</button>
				</div>
			)}
		</>
	);
};

export default LoginForm;
