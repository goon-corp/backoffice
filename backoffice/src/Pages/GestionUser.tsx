import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetUsers, useDeleteUser } from "../hooks/useUser";
import type { User } from "../Types/UserTypes";

const columns = [
	"Nom",
	"Prénom",
	"Identifiant",
	"Actif",
	"Créé le",
	"Édition",
	"Suppression",
];

export default function GestionUser() {
	const navigate = useNavigate();
	const { data: users = [], isLoading, isError } = useGetUsers();
	const [confirmId, setConfirmId] = useState<string | null>(null);

	const { mutate: deleteUser } = useDeleteUser({
		onSuccess: () => setConfirmId(null),
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Erreur lors de la récupération des utilisateurs.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-800">Utilisateurs</h2>
					<p className="text-sm text-gray-400">
						{users.length} utilisateur{users.length !== 1 ? "s" : ""}
					</p>
				</div>
				<button
					onClick={() => navigate("/user/ajout-utilisateur")}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
				>
					<span className="text-lg leading-none">+</span>
					Ajouter un utilisateur
				</button>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
					{columns.map((col) => (
						<span key={col}>{col}</span>
					))}
				</div>

				{users.length === 0 ? (
					<div className="py-16 text-center text-sm text-gray-400">
						Aucun utilisateur trouvé.
					</div>
				) : (
					users.map((user: User) => (
						<div
							key={user.id}
							className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50 transition"
						>
							<span className="text-sm text-gray-800 truncate">
								{user.last_name ?? "—"}
							</span>
							<span className="text-sm text-gray-800 truncate">
								{user.first_name ?? "—"}
							</span>
							<span className="text-sm text-gray-500 truncate">
								{user.user_name ?? "—"}
							</span>
							<span>
								<span
									className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
										user.is_active
											? "bg-green-50 text-green-700"
											: "bg-gray-100 text-gray-500"
									}`}
								>
									{user.is_active ? "Actif" : "Inactif"}
								</span>
							</span>
							<span className="text-sm text-gray-400">
								{new Date(user.creation_time).toLocaleDateString("fr-FR")}
							</span>

							<div>
								<button
									onClick={() => navigate(`/user/edition/${user.id}`)}
									className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
									title="Éditer"
								>
									✏️
								</button>
							</div>
							<div>
								{confirmId === user.id ? (
									<div className="flex items-center gap-2">
										<button
											onClick={() => deleteUser(user.id)}
											className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
										>
											Confirmer
										</button>
										<button
											onClick={() => setConfirmId(null)}
											className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
										>
											Annuler
										</button>
									</div>
								) : (
									<button
										onClick={() => setConfirmId(user.id)}
										className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
										title="Supprimer"
									>
										🗑️
									</button>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
