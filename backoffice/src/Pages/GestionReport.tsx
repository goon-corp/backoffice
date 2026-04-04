import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetReports, useDeleteReport } from "../hooks/useReport";
import { useGetReportTypes } from "../hooks/useReportType";
import { useGetUser } from "../hooks/useUser";
import { useGetRessource } from "../hooks/useRessource";
import type { ReportInfoDto } from "../Types/ReportTypes";
import { useQueryClient } from "@tanstack/react-query";

const columns = [
	"Type",
	"Ressource",
	"Utilisateur",
	"Modéré",
	"Créé le",
	"Édition",
	"Suppression",
];

function UserName({ id }: { id: string }) {
	const { data: user, isLoading } = useGetUser(id);
	if (isLoading) return <span className="text-sm text-gray-300">…</span>;
	if (!user) return <span className="text-sm text-gray-400">—</span>;
	const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
	return (
		<span className="text-sm text-gray-500 truncate">
			{name || user.user_name || user.id}
		</span>
	);
}

function RessourceTitle({ id }: { id: string }) {
	const { data: ressource, isLoading } = useGetRessource(id);
	if (isLoading) return <span className="text-sm text-gray-300">…</span>;
	if (!ressource) return <span className="text-sm text-gray-400">—</span>;
	return (
		<span className="text-sm text-gray-500 truncate">
			{ressource.title || ressource.id}
		</span>
	);
}

function ReportTypeName({ id }: { id: string }) {
	const { data: reportTypes = [] } = useGetReportTypes();
	const rt = reportTypes.find((t) => t.id === id);
	if (!rt) return <span className="text-sm text-gray-400">—</span>;
	return (
		<span className="text-sm text-gray-500 truncate">
			{rt.label || rt.id}
		</span>
	);
}

export default function GestionReport() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");

	const {
		data: reports = [],
		isLoading,
		isError,
	} = useGetReports();

	const { mutate: deleteReport } = useDeleteReport({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reports"] });
		},
	});

	const filtered = search
		? reports.filter((r) =>
				r.id.toLowerCase().includes(search.toLowerCase()) ||
				r.ressource_id.toLowerCase().includes(search.toLowerCase()),
			)
		: reports;

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
				Erreur lors de la récupération des reports.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-800">Reports</h2>
					<p className="text-sm text-gray-400">
						{filtered.length} report{filtered.length !== 1 ? "s" : ""}
					</p>
				</div>
				<button
					onClick={() => navigate("/report/ajout")}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
				>
					<span className="text-lg leading-none">+</span>
					Ajouter un report
				</button>
			</div>

			<div>
				<input
					type="text"
					placeholder="Rechercher un report…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-72"
				/>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
					{columns.map((col) => (
						<span key={col}>{col}</span>
					))}
				</div>

				{filtered.length === 0 ? (
					<div className="py-16 text-center text-sm text-gray-400">
						Aucun report trouvé.
					</div>
				) : (
					filtered.map((report: ReportInfoDto) => (
						<div
							key={report.id}
							className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50 transition"
						>
							<ReportTypeName id={report.report_type_id} />
							<RessourceTitle id={report.ressource_id} />
							<UserName id={report.user_id} />
							<span className="text-sm">
								{report.is_checked_by_moderator ? (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Oui
									</span>
								) : (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
										Non
									</span>
								)}
							</span>
							<span className="text-sm text-gray-500 truncate">
								{new Date(report.creation_time).toLocaleDateString("fr-FR")}
							</span>
							<div>
								<button
									onClick={() =>
										navigate(`/report/edition/${report.id}`)
									}
									className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
									title="Éditer"
								>
									✏️
								</button>
							</div>
							<div>
								<button
									onClick={() => {
										if (window.confirm("Supprimer ce report ?")) {
											deleteReport(report.id);
										}
									}}
									className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
									title="Supprimer"
								>
									🗑️
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
