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
import { quizzQuestionService } from "../Services/quizzQuestionService";

// ─── Quiz types ───────────────────────────────────────────────────────────────

interface QuizAnswer { id: string; text: string; }
interface QuizQuestion { id: string; question: string; answers: QuizAnswer[]; correctAnswerId: string; }

function generateId(): string { return Math.random().toString(36).slice(2, 9); }

function makeDefaultQuestion(): QuizQuestion {
	const a1 = { id: generateId(), text: "" };
	const a2 = { id: generateId(), text: "" };
	return { id: generateId(), question: "", answers: [a1, a2], correctAnswerId: a1.id };
}

// ─── QuizQuestionCard ─────────────────────────────────────────────────────────

function QuizQuestionCard({ question, index, hasError, onUpdate, onDelete }: {
	question: QuizQuestion; index: number; hasError: boolean;
	onUpdate: (q: QuizQuestion) => void; onDelete: () => void;
}) {
	const addAnswer = () => {
		if (question.answers.length >= 6) return;
		onUpdate({ ...question, answers: [...question.answers, { id: generateId(), text: "" }] });
	};

	const updateAnswer = (id: string, text: string) =>
		onUpdate({ ...question, answers: question.answers.map((a) => (a.id === id ? { ...a, text } : a)) });

	const deleteAnswer = (id: string) => {
		const next = question.answers.filter((a) => a.id !== id);
		onUpdate({ ...question, answers: next, correctAnswerId: question.correctAnswerId === id ? (next[0]?.id ?? "") : question.correctAnswerId });
	};

	return (
		<div className={`rounded-lg border ${hasError ? "border-red-400" : "border-gray-200"} bg-white mb-3 overflow-hidden`}>
			<div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
				<span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
					{index + 1}
				</span>
				<span className="flex-1 text-sm font-medium text-gray-700">Question {index + 1}</span>
				<button type="button" onClick={onDelete} className="p-1 hover:text-red-500 text-gray-400 transition">
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
				</button>
			</div>
			<div className="p-4 flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<label className="text-xs font-medium text-gray-600">Énoncé</label>
					<textarea
						rows={2}
						placeholder="Ex : Quelle est la capitale de la France ?"
						value={question.question}
						onChange={(e) => onUpdate({ ...question, question: e.target.value })}
						className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
					/>
				</div>
				<div>
					<p className="text-xs font-medium text-gray-600 mb-2">
						Réponses <span className="text-gray-400 font-normal">— cliquez pour marquer la bonne réponse</span>
					</p>
					{question.answers.map((answer, i) => {
						const isCorrect = answer.id === question.correctAnswerId;
						return (
							<div
								key={answer.id}
								onClick={() => onUpdate({ ...question, correctAnswerId: answer.id })}
								className={`flex items-center gap-2 border rounded-lg px-3 py-2 mb-1.5 cursor-pointer transition ${isCorrect ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
							>
								<div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isCorrect ? "border-blue-500" : "border-gray-300"}`}>
									{isCorrect && <div className="w-2 h-2 rounded-full bg-blue-500" />}
								</div>
								<input
									type="text"
									placeholder={`Réponse ${i + 1}…`}
									value={answer.text}
									onChange={(e) => { e.stopPropagation(); updateAnswer(answer.id, e.target.value); }}
									onClick={(e) => e.stopPropagation()}
									className="flex-1 border-none outline-none bg-transparent text-sm text-gray-800"
								/>
								{question.answers.length > 2 && (
									<button
										type="button"
										onClick={(e) => { e.stopPropagation(); deleteAnswer(answer.id); }}
										className="p-0.5 text-gray-400 hover:text-red-400 transition flex-shrink-0"
									>
										<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
									</button>
								)}
							</div>
						);
					})}
					{question.answers.length < 6 && (
						<button
							type="button"
							onClick={addAnswer}
							className="flex items-center gap-1.5 w-full border border-dashed border-blue-300 rounded-lg py-2 justify-center text-blue-600 text-xs hover:bg-blue-50 transition mt-1"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
							Ajouter une réponse
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

// ─── QuizQuestionsBuilder ─────────────────────────────────────────────────────

function QuizQuestionsBuilder({ questions, onChange, error }: {
	questions: QuizQuestion[];
	onChange: (q: QuizQuestion[]) => void;
	error?: string;
}) {
	const firstErrorIndex = error
		? questions.findIndex((q) => !q.question.trim() || q.answers.filter((a) => a.text.trim()).length < 2 || !q.answers.find((a) => a.id === q.correctAnswerId && a.text.trim()))
		: -1;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-700">Questions du quiz</span>
				<span className="min-w-[22px] h-[22px] rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center px-1.5">
					{questions.length}
				</span>
			</div>
			<p className="text-xs text-gray-400">Ajoutez au moins 1 question avec 2 réponses possibles.</p>
			{error && (
				<p className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
			)}
			{questions.map((q, i) => (
				<QuizQuestionCard
					key={q.id}
					question={q}
					index={i}
					hasError={!!error && i === firstErrorIndex}
					onUpdate={(updated) => { const next = [...questions]; next[i] = updated; onChange(next); }}
					onDelete={() => { if (questions.length <= 1) return; onChange(questions.filter((_, j) => j !== i)); }}
				/>
			))}
			<button
				type="button"
				onClick={() => onChange([...questions, makeDefaultQuestion()])}
				className="flex items-center justify-center gap-2 w-full border border-dashed border-blue-400 rounded-lg py-3 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
				Ajouter une question
			</button>
		</div>
	);
}

// ─── Form types ───────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AjoutResource() {
	const navigate = useNavigate();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: types = [] } = useGetRessourceTypes();
	const { data: confidentialityTypes = [] } =
		useGetRessourceConfidentialityTypes();
	const { data: tagsData } = useGetTags();
	const allTags = tagsData?.items ?? [];

	const { mutateAsync: createArticle, isPending: isPendingArticle } =
		useCreateArticle();
	const { mutateAsync: createEvent, isPending: isPendingEvent } = useCreateEvent();
	const { mutateAsync: createPoll, isPending: isPendingPoll } = useCreatePoll();
	const { mutateAsync: createQuizz, isPending: isPendingQuizz } = useCreateQuizz();

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
	const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => [makeDefaultQuestion()]);

	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isPending =
		isPendingArticle || isPendingEvent || isPendingPoll || isPendingQuizz || isSubmitting;

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
		} else if (selectedTypeLabel === "quizz") {
			if (quizQuestions.length === 0) {
				next.quizQuestions = "Ajoutez au moins une question.";
			} else {
				for (const q of quizQuestions) {
					if (!q.question.trim()) { next.quizQuestions = "Chaque question doit avoir un énoncé."; break; }
					if (q.answers.filter((a) => a.text.trim()).length < 2) { next.quizQuestions = "Chaque question doit avoir au moins 2 réponses remplies."; break; }
					if (!q.answers.find((a) => a.id === q.correctAnswerId && a.text.trim())) { next.quizQuestions = "Sélectionnez la bonne réponse pour chaque question."; break; }
				}
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate()) return;

		setIsSubmitting(true);
		try {
			if (selectedTypeLabel === "article") {
				const fd = buildRessourceFormData(baseForm, selectedType);
				fd.append("Content", articleFields.content);
				await createArticle(fd);
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
				await createEvent(fd);
			} else if (selectedTypeLabel === "sondage") {
				const fd = buildRessourceFormData(baseForm, selectedType);
				await createPoll(fd);
			} else if (selectedTypeLabel === "quizz") {
				const fd = buildRessourceFormData(baseForm, selectedType);
				const quizz = await createQuizz(fd);
				for (const q of quizQuestions) {
					await quizzQuestionService.create({
						question: q.question.trim(),
						possible_answers: q.answers.map((a) => a.text.trim()),
						correct_answer: q.answers.find((a) => a.id === q.correctAnswerId)?.text.trim() ?? "",
						quizz_id: quizz.id,
					});
				}
			}
			navigate("/gestion-ressource");
		} catch {
			setErrors({ general: "Erreur lors de la création." });
		} finally {
			setIsSubmitting(false);
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
							<QuizQuestionsBuilder
								questions={quizQuestions}
								onChange={setQuizQuestions}
								error={errors.quizQuestions}
							/>
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
