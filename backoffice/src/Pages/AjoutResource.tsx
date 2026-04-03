import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateRessource, useGetRessourceStatuses, useGetRessourceTypes, useGetRessourceConfidentialityTypes } from "../hooks/useRessource";

type FormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	type_id: string;
	tags: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

export default function AjoutResource() {
	const navigate = useNavigate();
	const { mutate: createRessource, isPending } = useCreateRessource();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: types = [] } = useGetRessourceTypes();
	const { data: confidentialityTypes = [] } = useGetRessourceConfidentialityTypes();

	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		status_id: "",
		confidentiality_type_id: "",
		type_id: "",
		tags: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.title.trim()) next.title = "Le titre est requis.";
		if (!formData.status_id) next.status_id = "Le statut est requis.";
		if (!formData.confidentiality_type_id) next.confidentiality_type_id = "La confidentialité est requise.";
		if (!formData.type_id) next.type_id = "Le type est requis.";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate()) return;

		const payload = new FormData();
		payload.append("title", formData.title);
		if (formData.description) payload.append("description", formData.description);
		payload.append("status_id", formData.status_id);
		payload.append("confidentiality_type_id", formData.confidentiality_type_id);
		payload.append("type_id", formData.type_id);
		if (formData.tags) {
			formData.tags.split(",").map((t) => t.trim()).filter(Boolean).forEach((tag) => {
				payload.append("tags", tag);
			});
		}

		createRessource(payload, {
			onSuccess: () => navigate("/gestion-resource"),
			onError: () => setErrors({ general: "Erreur lors de la création de la ressource." }),
		});
	};

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/gestion-resource")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">Ajouter une ressource</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="title" className="text-sm font-medium text-gray-700">
							Titre
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						/>
						{errors.title && (
							<span className="text-red-500 text-xs">{errors.title}</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="description" className="text-sm font-medium text-gray-700">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows={4}
							value={formData.description}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
						/>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="type_id" className="text-sm font-medium text-gray-700">
								Type
							</label>
							<select
								id="type_id"
								name="type_id"
								value={formData.type_id}
								onChange={handleChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							>
								<option value="">Sélectionnez</option>
								{types.map((t) => (
									<option key={t.id} value={t.id}>
										{t.label ?? t.id}
									</option>
								))}
							</select>
							{errors.type_id && (
								<span className="text-red-500 text-xs">{errors.type_id}</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label htmlFor="status_id" className="text-sm font-medium text-gray-700">
								Statut
							</label>
							<select
								id="status_id"
								name="status_id"
								value={formData.status_id}
								onChange={handleChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							>
								<option value="">Sélectionnez</option>
								{statuses.map((s) => (
									<option key={s.id} value={s.id}>
										{s.label ?? s.id}
									</option>
								))}
							</select>
							{errors.status_id && (
								<span className="text-red-500 text-xs">{errors.status_id}</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label htmlFor="confidentiality_type_id" className="text-sm font-medium text-gray-700">
								Confidentialité
							</label>
							<select
								id="confidentiality_type_id"
								name="confidentiality_type_id"
								value={formData.confidentiality_type_id}
								onChange={handleChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							>
								<option value="">Sélectionnez</option>
								{confidentialityTypes.map((c) => (
									<option key={c.id} value={c.id}>
										{c.label ?? c.id}
									</option>
								))}
							</select>
							{errors.confidentiality_type_id && (
								<span className="text-red-500 text-xs">{errors.confidentiality_type_id}</span>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="tags" className="text-sm font-medium text-gray-700">
							Tags
						</label>
						<input
							type="text"
							id="tags"
							name="tags"
							value={formData.tags}
							onChange={handleChange}
							placeholder="tag1, tag2, tag3"
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						/>
						<span className="text-xs text-gray-400">Séparés par des virgules</span>
					</div>

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
							{errors.general}
						</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={() => navigate("/gestion-resource")}
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
