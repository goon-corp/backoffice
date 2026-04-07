import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetReport, useUpdateReport } from "../hooks/useReport";
import { useGetReportTypes } from "../hooks/useReportType";
import { useGetRessource } from "../hooks/useRessource";
import { useGetUser } from "../hooks/useUser";

type FormData = {
	is_checked_by_moderator: boolean;
};

type FormErrors = Partial<Record<"general", string>>;

export default function EditionReport() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const { data: report, isLoading } = useGetReport(id!);
	const { mutate: updateReport, isPending } = useUpdateReport();
	const { data: reportTypes = [] } = useGetReportTypes();
	const { data: ressource } = useGetRessource(report?.ressource_id ?? "", {
		enabled: !!report?.ressource_id,
	});
	const { data: user } = useGetUser(report?.user_id ?? "", {
		enabled: !!report?.user_id,
	});

	const [formData, setFormData] = useState<FormData>({
		is_checked_by_moderator: false,
	});
	const [initialized, setInitialized] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	if (!initialized && report) {
		setFormData({
			is_checked_by_moderator: report.is_checked_by_moderator,
		});
		setInitialized(true);
	}

	const reportType = reportTypes.find(
		(rt) => rt.id === report?.report_type_id,
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!report) return;

		updateReport(
			{
				id: report.id,
				params: {
					is_checked_by_moderator: formData.is_checked_by_moderator,
				},
			},
			{
				onSuccess: () => navigate("/gestion-report"),
				onError: () =>
					setErrors({
						general: "Erreur lors de la mise à jour du report.",
					}),
			},
		);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	if (!report) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Report introuvable.
			</div>
		);
	}

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/gestion-report")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">
					Modifier un report
				</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex flex-col gap-4 mb-6 text-sm text-gray-600">
					<div>
						<span className="font-medium text-gray-700">Type : </span>
						{reportType?.label || report.report_type_id}
					</div>
					<div>
						<span className="font-medium text-gray-700">Ressource : </span>
						{ressource?.title ?? report.ressource_id}
					</div>
					<div>
						<span className="font-medium text-gray-700">Utilisateur : </span>
						{user
							? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
								user.user_name ||
								report.user_id
							: report.user_id}
					</div>
					<div>
						<span className="font-medium text-gray-700">Créé le : </span>
						{new Date(report.creation_time).toLocaleDateString("fr-FR")}
					</div>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="is_checked_by_moderator"
							checked={formData.is_checked_by_moderator}
							onChange={(e) =>
								setFormData({ is_checked_by_moderator: e.target.checked })
							}
							className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<label
							htmlFor="is_checked_by_moderator"
							className="text-sm font-medium text-gray-700"
						>
							Vérifié par un modérateur
						</label>
					</div>

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
							{errors.general}
						</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={() => navigate("/gestion-report")}
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
