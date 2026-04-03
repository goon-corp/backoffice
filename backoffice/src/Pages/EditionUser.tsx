import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetUser, useUpdateUser } from "../hooks/useUser";
import { useGetUserRoles } from "../hooks/useUserRole";
import type { User } from "../Types/UserTypes";
import type { UserRole } from "../Types/UserRoleTypes";

type FormData = {
	first_name: string;
	last_name: string;
	user_name: string;
	user_role_id: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

function UserForm({ user, roles, id }: { user: User; roles: UserRole[]; id: string }) {
	const navigate = useNavigate();
	const { mutate: updateUser, isPending } = useUpdateUser();

	const [formData, setFormData] = useState<FormData>({
		first_name: user.first_name ?? "",
		last_name: user.last_name ?? "",
		user_name: user.user_name ?? "",
		user_role_id: user.user_role_id,
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.first_name.trim()) next.first_name = "Le prénom est requis.";
		if (!formData.last_name.trim()) next.last_name = "Le nom est requis.";
		if (!formData.user_name.trim()) next.user_name = "L'identifiant est requis.";
		if (!formData.user_role_id) next.user_role_id = "Le rôle est requis.";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setErrors({});
		if (!validate()) return;

		updateUser(
			{ id, params: formData },
			{
				onSuccess: () => navigate("/gestion-user"),
				onError: () => setErrors({ general: "Erreur lors de la mise à jour." }),
			},
		);
	};

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/gestion-user")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">Modifier un utilisateur</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="last_name" className="text-sm font-medium text-gray-700">
								Nom
							</label>
							<input
								type="text"
								id="last_name"
								name="last_name"
								value={formData.last_name}
								onChange={handleChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
							{errors.last_name && (
								<span className="text-red-500 text-xs">{errors.last_name}</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label htmlFor="first_name" className="text-sm font-medium text-gray-700">
								Prénom
							</label>
							<input
								type="text"
								id="first_name"
								name="first_name"
								value={formData.first_name}
								onChange={handleChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
							{errors.first_name && (
								<span className="text-red-500 text-xs">{errors.first_name}</span>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="user_name" className="text-sm font-medium text-gray-700">
							Identifiant
						</label>
						<input
							type="text"
							id="user_name"
							name="user_name"
							value={formData.user_name}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						/>
						{errors.user_name && (
							<span className="text-red-500 text-xs">{errors.user_name}</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="user_role_id" className="text-sm font-medium text-gray-700">
							Rôle
						</label>
						<select
							id="user_role_id"
							name="user_role_id"
							value={formData.user_role_id}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
						>
							<option value="">Sélectionnez un rôle</option>
							{roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.role_label ?? role.id}
								</option>
							))}
						</select>
						{errors.user_role_id && (
							<span className="text-red-500 text-xs">{errors.user_role_id}</span>
						)}
					</div>

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
							{errors.general}
						</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={() => navigate("/gestion-user")}
							className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
						>
							{isPending ? "Mise à jour…" : "Enregistrer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function EditionUser() {
	const { id } = useParams<{ id: string }>();
	const { data: user, isLoading, isError } = useGetUser(id!);
	const { data: roles = [] } = useGetUserRoles();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	if (isError || !user) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Erreur lors de la récupération de l'utilisateur.
			</div>
		);
	}

	return <UserForm user={user} roles={roles} id={id!} />;
}
