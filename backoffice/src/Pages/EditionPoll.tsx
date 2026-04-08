import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
	useGetRessourceStatuses,
	useGetRessourceConfidentialityTypes,
} from "../hooks/useRessource";
import { useGetPollByRessource, useUpdatePoll } from "../hooks/usePoll";
import {
	useGetPollOptions,
	useCreatePollOption,
	useUpdatePollOption,
	useDeletePollOption,
} from "../hooks/usePollOption";
import { useGetTags } from "../hooks/useTag";
import type { PollOptionInfoDto } from "../Types/PollOptionTypes";

type FormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	tags: string[];
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

export default function EditionPoll({ id }: { id: string }) {
	const navigate = useNavigate();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: confidentialityTypes = [] } =
		useGetRessourceConfidentialityTypes();
	const { data: tagsData } = useGetTags();
	const allTags = tagsData?.items ?? [];
	const { data: poll, isLoading: isLoadingPoll } = useGetPollByRessource(id);
	const ressource = poll?.ressource;

	const { data: optionsData, isLoading: isLoadingOptions } =
		useGetPollOptions();
	const options = useMemo(
		() => {
			const allOptions = optionsData?.items ?? [];
			return poll ? allOptions.filter((o) => o.poll_id === poll.id) : [];
		},
		[optionsData, poll],
	);

	const { mutate: updatePoll, isPending } = useUpdatePoll();
	const { mutate: createOption } = useCreatePollOption();
	const { mutate: updateOption } = useUpdatePollOption();
	const { mutate: deleteOption } = useDeletePollOption();

	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		status_id: "",
		confidentiality_type_id: "",
		tags: [],
	});
	const [initialized, setInitialized] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [newOption, setNewOption] = useState("");
	const [editingOption, setEditingOption] = useState<{
		id: string;
		value: string;
	} | null>(null);

	if (!initialized && ressource) {
		setFormData({
			title: ressource.title ?? "",
			description: ressource.description ?? "",
			status_id: ressource.status?.id ?? "",
			confidentiality_type_id: ressource.confidentiality_type?.id ?? "",
			tags: ressource.tags?.map((t) => t.id) ?? [],
		});
		setInitialized(true);
	}

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.title.trim()) next.title = "Le titre est requis.";
		if (!formData.status_id) next.status_id = "Le statut est requis.";
		if (!formData.confidentiality_type_id)
			next.confidentiality_type_id = "La confidentialité est requise.";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate() || !poll || !ressource) return;

		updatePoll(
			{
				id: poll.id,
				params: {
					ressource: {
						title: formData.title,
						description: formData.description,
						tags: formData.tags,
						status_id: formData.status_id,
						confidentiality_type_id: formData.confidentiality_type_id,
						type_id: ressource.type.id,
					},
					options: options.map((o) => ({
						id: o.id,
						option: editingOption?.id === o.id ? editingOption.value : (o.option ?? ""),
					})),
				},
			},
			{
				onSuccess: () => navigate("/gestion-ressource"),
				onError: () =>
					setErrors({
						general: "Erreur lors de la mise à jour du sondage.",
					}),
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

	const handleDeleteOption = (optionId: string) => {
		deleteOption(optionId);
	};

	if (isLoadingPoll || isLoadingOptions) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	if (!poll) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Sondage introuvable pour cette ressource.
			</div>
		);
	}

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/gestion-ressource")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">
					Modifier un sondage
				</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="title"
							className="text-sm font-medium text-gray-700"
						>
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
						<label
							htmlFor="description"
							className="text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows={3}
							value={formData.description}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="status_id"
								className="text-sm font-medium text-gray-700"
							>
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
								<span className="text-red-500 text-xs">
									{errors.status_id}
								</span>
							)}
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="confidentiality_type_id"
								className="text-sm font-medium text-gray-700"
							>
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
								<span className="text-red-500 text-xs">
									{errors.confidentiality_type_id}
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="tags"
							className="text-sm font-medium text-gray-700"
						>
							Tags
						</label>
						<select
							id="tags"
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							value=""
							onChange={(e) => {
								const tagId = e.target.value;
								if (tagId && !formData.tags.includes(tagId)) {
									setFormData((prev) => ({
										...prev,
										tags: [...prev.tags, tagId],
									}));
								}
							}}
						>
							<option value="">Ajouter un tag…</option>
							{allTags
								.filter((t) => !formData.tags.includes(t.id))
								.map((t) => (
									<option key={t.id} value={t.id}>
										{t.label ?? t.id}
									</option>
								))}
						</select>
						{formData.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5 mt-1">
								{formData.tags.map((tagId) => {
									const tag = allTags.find((t) => t.id === tagId);
									return (
										<span
											key={tagId}
											className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs"
										>
											{tag?.label ?? tagId}
											<button
												type="button"
												onClick={() =>
													setFormData((prev) => ({
														...prev,
														tags: prev.tags.filter(
															(tid) => tid !== tagId,
														),
													}))
												}
												className="hover:text-red-500 transition"
											>
												&times;
											</button>
										</span>
									);
								})}
							</div>
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
							onClick={() => navigate("/gestion-ressource")}
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

			<div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
				<h3 className="text-sm font-semibold text-gray-800 mb-4">
					Options du sondage
				</h3>

				<div className="flex flex-col gap-3">
					{options.map((opt) => (
						<div key={opt.id} className="flex items-center gap-2">
							{editingOption?.id === opt.id ? (
								<>
									<input
										type="text"
										value={editingOption.value}
										onChange={(e) =>
											setEditingOption({
												id: opt.id,
												value: e.target.value,
											})
										}
										className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
									<button
										onClick={() => handleSaveOption(opt)}
										className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
									>
										OK
									</button>
									<button
										onClick={() => setEditingOption(null)}
										className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
									>
										Annuler
									</button>
								</>
							) : (
								<>
									<span className="flex-1 text-sm text-gray-700">
										{opt.option ?? "—"}
									</span>
									<button
										onClick={() =>
											setEditingOption({
												id: opt.id,
												value: opt.option ?? "",
											})
										}
										className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
										title="Modifier"
									>
										✏️
									</button>
									<button
										onClick={() => handleDeleteOption(opt.id)}
										className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
										title="Supprimer"
									>
										🗑️
									</button>
								</>
							)}
						</div>
					))}

					{options.length === 0 && (
						<p className="text-sm text-gray-400">
							Aucune option pour le moment.
						</p>
					)}

					<div className="flex items-center gap-2 pt-2 border-t border-gray-100">
						<input
							type="text"
							value={newOption}
							onChange={(e) => setNewOption(e.target.value)}
							placeholder="Nouvelle option…"
							className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddOption();
								}
							}}
						/>
						<button
							type="button"
							onClick={handleAddOption}
							className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
						>
							Ajouter
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
