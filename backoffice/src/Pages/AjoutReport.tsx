import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateReport } from "../hooks/useReport";
import { useGetReportTypes } from "../hooks/useReportType";

type FormData = {
	report_type_id: string;
	ressource_id: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

export default function AjoutReport() {
	const navigate = useNavigate();
	const { mutate: createReport, isPending } = useCreateReport();
	const { data: reportTypes = [] } = useGetReportTypes();

	const [formData, setFormData] = useState<FormData>({
		report_type_id: "",
		ressource_id: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.report_type_id.trim())
			next.report_type_id = "Le type de report est requis.";
		if (!formData.ressource_id.trim())
			next.ressource_id = "L'ID de la ressource est requis.";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate()) return;

		createReport(
			{
				report_type_id: formData.report_type_id,
				ressource_id: formData.ressource_id,
			},
			{
				onSuccess: () => navigate("/gestion-report"),
				onError: () =>
					setErrors({
						general: "Erreur lors de la création du report.",
					}),
			},
		);
	};

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
					Ajouter un report
				</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="report_type_id"
							className="text-sm font-medium text-gray-700"
						>
							Type de report
						</label>
						<select
							id="report_type_id"
							name="report_type_id"
							value={formData.report_type_id}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						>
							<option value="">Sélectionner un type</option>
							{reportTypes.map((rt) => (
								<option key={rt.id} value={rt.id}>
									{rt.label || rt.id}
								</option>
							))}
						</select>
						{errors.report_type_id && (
							<span className="text-red-500 text-xs">
								{errors.report_type_id}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="ressource_id"
							className="text-sm font-medium text-gray-700"
						>
							ID Ressource
						</label>
						<input
							type="text"
							id="ressource_id"
							name="ressource_id"
							value={formData.ressource_id}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						/>
						{errors.ressource_id && (
							<span className="text-red-500 text-xs">
								{errors.ressource_id}
							</span>
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
							{isPending ? "Création…" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
