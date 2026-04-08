import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetRessources, useGetRessourceTypes } from "../hooks/useRessource";
import type { ReturnRessourceDto } from "../Types/RessourceTypes";

const columns = [
	"Titre",
	"Type",
	"Statut",
	"Confidentialité",
	"Tags",
	"Édition",
];

export default function GestionResource() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [type, setType] = useState("");
	const [isDeleted, setIsDeleted] = useState(false);
	const [page, setPage] = useState(1);

	const { data: types = [] } = useGetRessourceTypes();

	const params = {
		...(title && { RessourceTitle: title }),
		...(type && { RessourceType: type }),
		IsDeleted: isDeleted,
		page,
	};

	const {
		data,
		isLoading,
		isError,
	} = useGetRessources(params);
	const ressources = data?.items ?? [];
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
				Erreur lors de la récupération des ressources.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-800">Ressources</h2>
					<p className="text-sm text-gray-400">
						{data?.total_count ?? ressources.length} ressource{(data?.total_count ?? ressources.length) !== 1 ? "s" : ""}
					</p>
				</div>
				<button
					onClick={() => navigate("/ressource/ajout")}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
				>
					<span className="text-lg leading-none">+</span>
					Ajouter une ressource
				</button>
			</div>

			<div className="flex items-center gap-4 flex-wrap">
				<input
					type="text"
					placeholder="Filtrer par titre…"
					value={title}
					onChange={(e) => { setTitle(e.target.value); setPage(1); }}
					className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-60"
				/>
				<select
					value={type}
					onChange={(e) => { setType(e.target.value); setPage(1); }}
					className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
				>
					<option value="">Tous les types</option>
					{types.map((t) => (
						<option key={t.id} value={t.label ?? ""}>
							{t.label}
						</option>
					))}
				</select>
				<label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
					<input
						type="checkbox"
						checked={isDeleted}
						onChange={(e) => { setIsDeleted(e.target.checked); setPage(1); }}
						className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					Afficher les supprimées
				</label>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
					{columns.map((col) => (
						<span key={col}>{col}</span>
					))}
				</div>

				{ressources.length === 0 ? (
					<div className="py-16 text-center text-sm text-gray-400">
						Aucune ressource trouvée.
					</div>
				) : (
					ressources.map((ressource: ReturnRessourceDto) => (
						<div
							key={ressource.id}
							className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50 transition"
						>
							<span className="text-sm text-gray-800 truncate">
								{ressource.title ?? "—"}
							</span>
							<span className="text-sm text-gray-500 truncate">
								{ressource.type?.label ?? "—"}
							</span>
							<span>
								<StatusBadge label={ressource.status?.label} />
							</span>
							<span className="text-sm text-gray-500 truncate">
								{ressource.confidentiality_type?.label ?? "—"}
							</span>
							<div className="flex flex-wrap gap-1">
								{ressource.tags && ressource.tags.length > 0 ? (
									ressource.tags.map((tag) => (
										<span
											key={tag.id}
											className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
										>
											{tag.label ?? tag.id}
										</span>
									))
								) : (
									<span className="text-sm text-gray-400">—</span>
								)}
							</div>
							<div>
								<button
									onClick={() =>
										navigate(
											`/ressource/edition/${ressource.id}?type=${ressource.type?.label}`,
										)
									}
									className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
									title="Éditer"
								>
									✏️
								</button>
							</div>
						</div>
					))
				)}
			</div>

				{(data?.total_pages ?? 1) > 1 && (
					<div className="flex items-center justify-between">
						<button
							disabled={!data?.has_previous_page}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Précédent
						</button>
						<span className="text-sm text-gray-500">
							Page {data?.page_index ?? page} sur {data?.total_pages ?? 1}
						</span>
						<button
							disabled={!data?.has_next_page}
							onClick={() => setPage((p) => p + 1)}
							className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Suivant
						</button>
					</div>
				)}
		</div>
	);
}

function StatusBadge({ label }: { label: string | null | undefined }) {
	const text = label ?? "—";
	const lower = text.toLowerCase();

	let classes = "bg-gray-100 text-gray-500";
	if (
		lower.includes("actif") ||
		lower.includes("publié") ||
		lower.includes("valid")
	) {
		classes = "bg-green-50 text-green-700";
	} else if (
		lower.includes("brouillon") ||
		lower.includes("draft") ||
		lower.includes("attente")
	) {
		classes = "bg-yellow-50 text-yellow-700";
	} else if (
		lower.includes("archiv") ||
		lower.includes("inactif") ||
		lower.includes("rejet")
	) {
		classes = "bg-red-50 text-red-700";
	}

	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}
		>
			{text}
		</span>
	);
}
