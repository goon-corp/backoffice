import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useUpdateRessource, useGetRessourceStatuses, useGetRessourceConfidentialityTypes } from "../hooks/useRessource";
import { useGetPolls } from "../hooks/usePoll";
import { useGetPollOptions, useCreatePollOption, useUpdatePollOption, useDeletePollOption } from "../hooks/usePollOption";
import type { ReturnRessourceDto, UpdateRessourceDto } from "../Types/RessourceTypes";
import type { PollOptionInfoDto } from "../Types/PollOptionTypes";

type FormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	tags: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

export default function EditionPoll({ ressource }: { ressource: ReturnRessourceDto }) {
	const navigate = useNavigate();
	const { mutate: updateRessource, isPending: isPendingRessource } = useUpdateRessource();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: confidentialityTypes = [] } = useGetRessourceConfidentialityTypes();

	const { data: polls = [], isLoading: isLoadingPoll } = useGetPolls();
	const poll = useMemo(() => polls.find((p) => p.ressource_id === ressource.id), [polls, ressource.id]);

	const { data: allOptions = [], isLoading: isLoadingOptions } = useGetPollOptions();
	const options = useMemo(
		() => (poll ? allOptions.filter((o) => o.poll_id === poll.id) : []),
		[allOptions, poll],
	);

	const { mutate: createOption } = useCreatePollOption();
	const { mutate: updateOption } = useUpdatePollOption();
	const { mutate: deleteOption } = useDeletePollOption();

	const [formData, setFormData] = useState<FormData>({
		title: ressource.title ?? "",
		description: ressource.description ?? "",
		status_id: ressource.status?.id ?? "",
		confidentiality_type_id: ressource.confidentiality_type?.id ?? "",
		tags: ressource.tags?.map((t) => t.label ?? t.id).join(", ") ?? "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [newOption, setNewOption] = useState("");
	const [editingOption, setEditingOption] = useState<{ id: string; value: string } | null>(null);

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.title.trim()) next.title = "Le titre est requis.";
		if (!formData.status_id) next.status_id = "Le statut est requis.";
		if (!formData.confidentiality_type_id) next.confidentiality_type_id = "La confidentialité est requise.";
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

		const ressourcePayload: UpdateRessourceDto = {
			title: formData.title || null,
			description: formData.description || null,
			status_id: formData.status_id,
			confidentiality_type_id: formData.confidentiality_type_id,
			type_id: ressource.type.id,
			tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
		};

		updateRessource(
			{ id: ressource.id, params: ressourcePayload },
			{
				onSuccess: () => navigate("/gestion-ressource"),
				onError: () => setErrors({ general: "Erreur lors de la mise à jour de la ressource." }),
			},
		);
	};

	const handleAddOption = () => {
		if (!newOption.trim() || !poll) return;
		createOption(
			{ option: newOption.trim(), poll_id: poll.id },
			{ onSuccess: () => setNewOption("") },
		);
	};

	const handleSaveOption = (opt: PollOptionInfoDto) => {
		if (!editingOption) return;
		updateOption(
			{ id: opt.id, params: { option: editingOption.value } },
			{ onSuccess: () => setEditingOption(null) },
		);
	};

	const handleDeleteOption = (id: string) => {
		deleteOption(id);
	};

	if (isLoadingPoll || isLoadingOptions) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button onClick={() => navigate("/gestion-ressource")} className="text-gray-400 hover:text-gray-600 transition text-sm">
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">Modifier un sondage</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="title" className="text-sm font-medium text-gray-700">Titre</label>
						<input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
						{errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
						<textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none" />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="status_id" className="text-sm font-medium text-gray-700">Statut</label>
							<select id="status_id" name="status_id" value={formData.status_id} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white">
								<option value="">Sélectionnez</option>
								{statuses.map((s) => <option key={s.id} value={s.id}>{s.label ?? s.id}</option>)}
							</select>
							{errors.status_id && <span className="text-red-500 text-xs">{errors.status_id}</span>}
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="confidentiality_type_id" className="text-sm font-medium text-gray-700">Confidentialité</label>
							<select id="confidentiality_type_id" name="confidentiality_type_id" value={formData.confidentiality_type_id} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white">
								<option value="">Sélectionnez</option>
								{confidentialityTypes.map((c) => <option key={c.id} value={c.id}>{c.label ?? c.id}</option>)}
							</select>
							{errors.confidentiality_type_id && <span className="text-red-500 text-xs">{errors.confidentiality_type_id}</span>}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags</label>
						<input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="tag1, tag2, tag3" className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
						<span className="text-xs text-gray-400">Séparés par des virgules</span>
					</div>

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{errors.general}</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button type="button" onClick={() => navigate("/gestion-ressource")} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">Annuler</button>
						<button type="submit" disabled={isPendingRessource} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
							{isPendingRessource ? "Mise à jour…" : "Enregistrer"}
						</button>
					</div>
				</form>
			</div>

			{poll && (
				<div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
					<h3 className="text-sm font-semibold text-gray-800 mb-4">Options du sondage</h3>

					<div className="flex flex-col gap-3">
						{options.map((opt) => (
							<div key={opt.id} className="flex items-center gap-2">
								{editingOption?.id === opt.id ? (
									<>
										<input
											type="text"
											value={editingOption.value}
											onChange={(e) => setEditingOption({ id: opt.id, value: e.target.value })}
											className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
										/>
										<button onClick={() => handleSaveOption(opt)} className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">OK</button>
										<button onClick={() => setEditingOption(null)} className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700">Annuler</button>
									</>
								) : (
									<>
										<span className="flex-1 text-sm text-gray-700">{opt.option ?? "—"}</span>
										<button onClick={() => setEditingOption({ id: opt.id, value: opt.option ?? "" })} className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Modifier">✏️</button>
										<button onClick={() => handleDeleteOption(opt.id)} className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition" title="Supprimer">🗑️</button>
									</>
								)}
							</div>
						))}

						{options.length === 0 && (
							<p className="text-sm text-gray-400">Aucune option pour le moment.</p>
						)}

						<div className="flex items-center gap-2 pt-2 border-t border-gray-100">
							<input
								type="text"
								value={newOption}
								onChange={(e) => setNewOption(e.target.value)}
								placeholder="Nouvelle option…"
								className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
								onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddOption(); } }}
							/>
							<button type="button" onClick={handleAddOption} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition">Ajouter</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
