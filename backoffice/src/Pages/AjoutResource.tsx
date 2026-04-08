import { useState } from "react";
import { useNavigate } from "react-router";
import {
	useGetRessourceStatuses,
	useGetRessourceTypes,
	useGetRessourceConfidentialityTypes,
} from "../hooks/useRessource";
import { useCreateArticle } from "../hooks/useArticle";
import { useCreateEvent } from "../hooks/useEvent";
import { useCreatePoll } from "../hooks/usePoll";
import { useCreateQuizz } from "../hooks/useQuizz";
import { useGetTags } from "../hooks/useTag";

type BaseFormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	tags: string[];
};

type ArticleFields = { content: string };
type EventFields = {
	is_virtual: boolean;
	date_start: string;
	date_end: string;
	event_link: string;
	location: string;
};
type FormErrors = Partial<Record<string, string>>;

function buildRessourceFormData(
	base: BaseFormData,
	typeId: string,
	prefix = "Ressource",
): FormData {
	const fd = new FormData();
	fd.append(`${prefix}.Title`, base.title);
	if (base.description) fd.append(`${prefix}.Description`, base.description);
	fd.append(`${prefix}.StatusId`, base.status_id);
	fd.append(`${prefix}.ConfidentialityTypeId`, base.confidentiality_type_id);
	fd.append(`${prefix}.TypeId`, typeId);
	base.tags.forEach((tag) => fd.append(`${prefix}.Tags`, tag));
	return fd;
}

export default function AjoutResource() {
	const navigate = useNavigate();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: types = [] } = useGetRessourceTypes();
	const { data: confidentialityTypes = [] } =
		useGetRessourceConfidentialityTypes();
	const { data: tagsData } = useGetTags();
	const allTags = tagsData?.items ?? [];

	const { mutate: createArticle, isPending: isPendingArticle } =
		useCreateArticle();
	const { mutate: createEvent, isPending: isPendingEvent } = useCreateEvent();
	const { mutate: createPoll, isPending: isPendingPoll } = useCreatePoll();
	const { mutate: createQuizz, isPending: isPendingQuizz } = useCreateQuizz();

	const [selectedType, setSelectedType] = useState<string>("");
	const selectedTypeLabel =
		types.find((t) => t.id === selectedType)?.label?.toLowerCase() ?? "";

	const [baseForm, setBaseForm] = useState<BaseFormData>({
		title: "",
		description: "",
		status_id: "",
		confidentiality_type_id: "",
		tags: [],
	});

	const [articleFields, setArticleFields] = useState<ArticleFields>({
		content: "",
	});
	const [eventFields, setEventFields] = useState<EventFields>({
		is_virtual: false,
		date_start: "",
		date_end: "",
		event_link: "",
		location: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const isPending =
		isPendingArticle || isPendingEvent || isPendingPoll || isPendingQuizz;

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!baseForm.title.trim()) next.title = "Le titre est requis.";
		if (!baseForm.status_id) next.status_id = "Le statut est requis.";
		if (!baseForm.confidentiality_type_id)
			next.confidentiality_type_id = "La confidentialité est requise.";

		if (selectedTypeLabel === "article") {
			if (!articleFields.content.trim())
				next.content = "Le contenu est requis.";
		} else if (selectedTypeLabel === "événement") {
			if (!eventFields.date_start)
				next.date_start = "La date de début est requise.";
			if (!eventFields.date_end) next.date_end = "La date de fin est requise.";
			if (
				eventFields.date_start &&
				eventFields.date_end &&
				eventFields.date_start >= eventFields.date_end
			) {
				next.date_end = "La date de fin doit être après la date de début.";
			}
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleBaseChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setBaseForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate()) return;

		const onSuccess = () => navigate("/gestion-ressource");
		const onError = () => setErrors({ general: "Erreur lors de la création." });

		if (selectedTypeLabel === "article") {
			const fd = buildRessourceFormData(baseForm, selectedType);
			fd.append("Content", articleFields.content);
			createArticle(fd, { onSuccess, onError });
		} else if (selectedTypeLabel === "événement") {
			const fd = buildRessourceFormData(
				baseForm,
				selectedType,
				"RessourceInfos",
			);
			fd.append("IsVirtual", String(eventFields.is_virtual));
			fd.append("DateStart", new Date(eventFields.date_start).toISOString());
			fd.append("DateEnd", new Date(eventFields.date_end).toISOString());
			if (eventFields.event_link)
				fd.append("EventLink", eventFields.event_link);
			if (eventFields.location) fd.append("Location", eventFields.location);
			createEvent(fd, { onSuccess, onError });
		} else if (selectedTypeLabel === "sondage") {
			const fd = buildRessourceFormData(baseForm, selectedType);
			createPoll(fd, { onSuccess, onError });
		} else if (selectedTypeLabel === "quizz") {
			const fd = buildRessourceFormData(baseForm, selectedType);
			createQuizz(fd, { onSuccess, onError });
		}
	};

	if (!selectedType) {
		return (
			<div className="max-w-xl">
				<div className="flex items-center gap-3 mb-6">
					<button
						onClick={() => navigate("/gestion-resource")}
						className="text-gray-400 hover:text-gray-600 transition text-sm"
					>
						← Retour
					</button>
					<h2 className="text-xl font-semibold text-gray-800">
						Ajouter une ressource
					</h2>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<p className="text-sm font-medium text-gray-700 mb-4">
						Choisissez le type de ressource :
					</p>
					<div className="grid grid-cols-2 gap-3">
						{types.map((t) => (
							<button
								key={t.id}
								onClick={() => setSelectedType(t.id)}
								className="px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
							>
								{t.label ?? t.id}
							</button>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => setSelectedType("")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">
					Ajouter{" "}
					{selectedTypeLabel === "article"
						? "un article"
						: selectedTypeLabel === "événement"
							? "un événement"
							: selectedTypeLabel === "sondage"
								? "un sondage"
								: selectedTypeLabel === "quizz"
									? "un quiz"
									: "une ressource"}
				</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{/* Base fields */}
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
							value={baseForm.title}
							onChange={handleBaseChange}
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
							value={baseForm.description}
							onChange={handleBaseChange}
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
								value={baseForm.status_id}
								onChange={handleBaseChange}
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
							<label
								htmlFor="confidentiality_type_id"
								className="text-sm font-medium text-gray-700"
							>
								Confidentialité
							</label>
							<select
								id="confidentiality_type_id"
								name="confidentiality_type_id"
								value={baseForm.confidentiality_type_id}
								onChange={handleBaseChange}
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
						<label htmlFor="tags" className="text-sm font-medium text-gray-700">
							Tags
						</label>
						<select
							id="tags"
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							value=""
							onChange={(e) => {
								const tagId = e.target.value;
								if (tagId && !baseForm.tags.includes(tagId)) {
									setBaseForm((prev) => ({
										...prev,
										tags: [...prev.tags, tagId],
									}));
								}
							}}
						>
							<option value="">Ajouter un tag…</option>
							{allTags
								.filter((t) => !baseForm.tags.includes(t.id))
								.map((t) => (
									<option key={t.id} value={t.id}>
										{t.label ?? t.id}
									</option>
								))}
						</select>
						{baseForm.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5 mt-1">
								{baseForm.tags.map((tagId) => {
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
													setBaseForm((prev) => ({
														...prev,
														tags: prev.tags.filter((id) => id !== tagId),
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

					{/* Type-specific fields */}
					{selectedTypeLabel === "article" && (
						<>
							<hr className="border-gray-200" />
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="content"
									className="text-sm font-medium text-gray-700"
								>
									Contenu de l'article
								</label>
								<textarea
									id="content"
									name="content"
									rows={10}
									value={articleFields.content}
									onChange={(e) =>
										setArticleFields({ content: e.target.value })
									}
									className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
								/>
								{errors.content && (
									<span className="text-red-500 text-xs">{errors.content}</span>
								)}
							</div>
						</>
					)}

					{selectedTypeLabel === "événement" && (
						<>
							<hr className="border-gray-200" />
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="is_virtual"
									checked={eventFields.is_virtual}
									onChange={(e) =>
										setEventFields((prev) => ({
											...prev,
											is_virtual: e.target.checked,
										}))
									}
									className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="is_virtual"
									className="text-sm font-medium text-gray-700"
								>
									Événement virtuel
								</label>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor="date_start"
										className="text-sm font-medium text-gray-700"
									>
										Date de début
									</label>
									<input
										type="datetime-local"
										id="date_start"
										value={eventFields.date_start}
										onChange={(e) =>
											setEventFields((prev) => ({
												...prev,
												date_start: e.target.value,
											}))
										}
										className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
									{errors.date_start && (
										<span className="text-red-500 text-xs">
											{errors.date_start}
										</span>
									)}
								</div>
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor="date_end"
										className="text-sm font-medium text-gray-700"
									>
										Date de fin
									</label>
									<input
										type="datetime-local"
										id="date_end"
										value={eventFields.date_end}
										onChange={(e) =>
											setEventFields((prev) => ({
												...prev,
												date_end: e.target.value,
											}))
										}
										className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
									{errors.date_end && (
										<span className="text-red-500 text-xs">
											{errors.date_end}
										</span>
									)}
								</div>
							</div>

							{eventFields.is_virtual ? (
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor="event_link"
										className="text-sm font-medium text-gray-700"
									>
										Lien de l'événement
									</label>
									<input
										type="url"
										id="event_link"
										value={eventFields.event_link}
										onChange={(e) =>
											setEventFields((prev) => ({
												...prev,
												event_link: e.target.value,
											}))
										}
										placeholder="https://..."
										className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
								</div>
							) : (
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor="location"
										className="text-sm font-medium text-gray-700"
									>
										Lieu
									</label>
									<input
										type="text"
										id="location"
										value={eventFields.location}
										onChange={(e) =>
											setEventFields((prev) => ({
												...prev,
												location: e.target.value,
											}))
										}
										className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
								</div>
							)}
						</>
					)}

					{selectedTypeLabel === "sondage" && (
						<>
							<hr className="border-gray-200" />
							<p className="text-xs text-gray-400">
								Les options du sondage pourront être ajoutées après la création,
								via la page d'édition.
							</p>
						</>
					)}

					{selectedTypeLabel === "quizz" && (
						<>
							<hr className="border-gray-200" />
							<p className="text-xs text-gray-400">
								Les questions du quiz pourront être ajoutées après la création,
								via la page d'édition.
							</p>
						</>
					)}

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
							{errors.general}
						</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={() => setSelectedType("")}
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
