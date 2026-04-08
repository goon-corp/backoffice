import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
	useGetRessourceStatuses,
	useGetRessourceConfidentialityTypes,
} from "../hooks/useRessource";
import { useGetQuizzByRessource, useUpdateQuizz } from "../hooks/useQuizz";
import { useGetQuizzQuestions } from "../hooks/useQuizzQuestion";
import { useGetTags } from "../hooks/useTag";
import { quizzQuestionService } from "../Services/quizzQuestionService";
import type { QuizzQuestionInfoDto } from "../Types/QuizzQuestionTypes";

// ─── Quiz types ───────────────────────────────────────────────────────────────

interface QuizAnswer { id: string; text: string; }
interface QuizQuestion { id: string; question: string; answers: QuizAnswer[]; correctAnswerId: string; }

function generateId(): string { return Math.random().toString(36).slice(2, 9); }

function apiQuestionToLocal(q: QuizzQuestionInfoDto): QuizQuestion {
	let answers: QuizAnswer[];
	try {
		const parsed: string[] = JSON.parse(q.possible_answers ?? "[]");
		answers = Array.isArray(parsed) && parsed.length >= 2
			? parsed.map((text) => ({ id: generateId(), text }))
			: [{ id: generateId(), text: "" }, { id: generateId(), text: "" }];
	} catch {
		answers = [{ id: generateId(), text: "" }, { id: generateId(), text: "" }];
	}
	const correctAnswer = q.correct_answer ?? "";
	const correctItem = answers.find((a) => a.text === correctAnswer);
	return {
		id: q.id,
		question: q.question ?? "",
		answers,
		correctAnswerId: correctItem?.id ?? answers[0]?.id ?? "",
	};
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
				<span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
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
								<div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${isCorrect ? "border-blue-500" : "border-gray-300"}`}>
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
										className="p-0.5 text-gray-400 hover:text-red-400 transition shrink-0"
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
				<span className="min-w-5.5 h-5.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center px-1.5">
					{questions.length}
				</span>
			</div>
			<p className="text-xs text-gray-400">Au moins 1 question avec 2 réponses possibles.</p>
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
				onClick={() => {
					const a1 = { id: generateId(), text: "" };
					const a2 = { id: generateId(), text: "" };
					onChange([...questions, { id: generateId(), question: "", answers: [a1, a2], correctAnswerId: a1.id }]);
				}}
				className="flex items-center justify-center gap-2 w-full border border-dashed border-blue-400 rounded-lg py-3 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
				Ajouter une question
			</button>
		</div>
	);
}

// ─── Form types ───────────────────────────────────────────────────────────────

type MetaFormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	tags: string[];
};

type FormErrors = Partial<Record<keyof MetaFormData | "general" | "quizQuestions", string>>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditionQuizz({ id }: { id: string }) {
	const navigate = useNavigate();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: confidentialityTypes = [] } = useGetRessourceConfidentialityTypes();
	const { data: tagsData } = useGetTags();
	const allTags = tagsData?.items ?? [];

	const { data: quizz, isLoading: isLoadingQuizz } = useGetQuizzByRessource(id);
	const ressource = quizz?.ressource;

	const { data: apiQuestions = [], isLoading: isLoadingQuestions } = useGetQuizzQuestions(quizz?.id);

	const { mutateAsync: updateQuizz, isPending } = useUpdateQuizz();

	const [metaForm, setMetaForm] = useState<MetaFormData>({
		title: "", description: "", status_id: "", confidentiality_type_id: "", tags: [],
	});
	const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>([]);
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Track which IDs came from the API (UUIDs) vs locally generated
	const apiIdsRef = useRef<Set<string>>(new Set());
	const metaInitialized = useRef(false);
	const questionsInitialized = useRef(false);

	if (!metaInitialized.current && ressource) {
		setMetaForm({
			title: ressource.title ?? "",
			description: ressource.description ?? "",
			status_id: ressource.status?.id ?? "",
			confidentiality_type_id: ressource.confidentiality_type?.id ?? "",
			tags: ressource.tags?.map((t: { id: string; label: string }) => t.id) ?? [],
		});
		metaInitialized.current = true;
	}

	if (!questionsInitialized.current && !isLoadingQuestions && apiQuestions.length >= 0 && quizz) {
		const converted = apiQuestions.map(apiQuestionToLocal);
		setLocalQuestions(converted);
		apiIdsRef.current = new Set(converted.map((q) => q.id));
		questionsInitialized.current = true;
	}

	const validateQuestions = (): boolean => {
		if (localQuestions.length === 0) return false;
		for (const q of localQuestions) {
			if (!q.question.trim()) return false;
			if (q.answers.filter((a) => a.text.trim()).length < 2) return false;
			if (!q.answers.find((a) => a.id === q.correctAnswerId && a.text.trim())) return false;
		}
		return true;
	};

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!metaForm.title.trim()) next.title = "Le titre est requis.";
		if (!metaForm.status_id) next.status_id = "Le statut est requis.";
		if (!metaForm.confidentiality_type_id)
			next.confidentiality_type_id = "La confidentialité est requise.";
		if (localQuestions.length === 0) {
			next.quizQuestions = "Ajoutez au moins une question.";
		} else if (!validateQuestions()) {
			next.quizQuestions = "Vérifiez que chaque question a un énoncé, au moins 2 réponses et une bonne réponse sélectionnée.";
		}
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setMetaForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate() || !quizz || !ressource) return;

		setIsSubmitting(true);
		try {
			const currentApiIds = new Set(localQuestions.filter((q) => apiIdsRef.current.has(q.id)).map((q) => q.id));
			const deletedIds = [...apiIdsRef.current].filter((id) => !currentApiIds.has(id));
			const newQuestions = localQuestions.filter((q) => !apiIdsRef.current.has(q.id));
			const updatedQuestions = localQuestions.filter((q) => apiIdsRef.current.has(q.id));

			await updateQuizz({
				id: quizz.id,
				params: {
					ressource: {
						title: metaForm.title,
						description: metaForm.description,
						tags: metaForm.tags,
						status_id: metaForm.status_id,
						confidentiality_type_id: metaForm.confidentiality_type_id,
						type_id: ressource.type.id,
					},
					options: updatedQuestions.map((q) => ({ id: q.id, option: q.question })),
				},
			});

			for (const id of deletedIds) {
				await quizzQuestionService.delete(id);
			}

			for (const q of updatedQuestions) {
				await quizzQuestionService.update(q.id, {
					question: q.question.trim(),
					possible_answers: q.answers.map((a) => a.text.trim()),
					correct_answer: q.answers.find((a) => a.id === q.correctAnswerId)?.text.trim() ?? null,
				});
			}

			for (const q of newQuestions) {
				await quizzQuestionService.create({
					question: q.question.trim(),
					possible_answers: q.answers.map((a) => a.text.trim()),
					correct_answer: q.answers.find((a) => a.id === q.correctAnswerId)?.text.trim() ?? "",
					quizz_id: quizz.id,
				});
			}

			navigate("/gestion-ressource");
		} catch {
			setErrors({ general: "Erreur lors de la mise à jour du quiz." });
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoadingQuizz || isLoadingQuestions) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	if (!quizz) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Quiz introuvable pour cette ressource.
			</div>
		);
	}

	const isBusy = isPending || isSubmitting;

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/gestion-ressource")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">Modifier un quiz</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="title" className="text-sm font-medium text-gray-700">Titre</label>
						<input
							type="text" id="title" name="title"
							value={metaForm.title} onChange={handleMetaChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						/>
						{errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
						<textarea
							id="description" name="description" rows={3}
							value={metaForm.description} onChange={handleMetaChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="status_id" className="text-sm font-medium text-gray-700">Statut</label>
							<select
								id="status_id" name="status_id"
								value={metaForm.status_id} onChange={handleMetaChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							>
								<option value="">Sélectionnez</option>
								{statuses.map((s) => (
									<option key={s.id} value={s.id}>{s.label ?? s.id}</option>
								))}
							</select>
							{errors.status_id && <span className="text-red-500 text-xs">{errors.status_id}</span>}
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="confidentiality_type_id" className="text-sm font-medium text-gray-700">Confidentialité</label>
							<select
								id="confidentiality_type_id" name="confidentiality_type_id"
								value={metaForm.confidentiality_type_id} onChange={handleMetaChange}
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							>
								<option value="">Sélectionnez</option>
								{confidentialityTypes.map((c) => (
									<option key={c.id} value={c.id}>{c.label ?? c.id}</option>
								))}
							</select>
							{errors.confidentiality_type_id && <span className="text-red-500 text-xs">{errors.confidentiality_type_id}</span>}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags</label>
						<select
							id="tags" className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
							value=""
							onChange={(e) => {
								const tagId = e.target.value;
								if (tagId && !metaForm.tags.includes(tagId)) {
									setMetaForm((prev) => ({ ...prev, tags: [...prev.tags, tagId] }));
								}
							}}
						>
							<option value="">Ajouter un tag…</option>
							{allTags.filter((t) => !metaForm.tags.includes(t.id)).map((t) => (
								<option key={t.id} value={t.id}>{t.label ?? t.id}</option>
							))}
						</select>
						{metaForm.tags.length > 0 && (
							<div className="flex flex-wrap gap-1.5 mt-1">
								{metaForm.tags.map((tagId) => {
									const tag = allTags.find((t) => t.id === tagId);
									return (
										<span key={tagId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">
											{tag?.label ?? tagId}
											<button
												type="button"
												onClick={() => setMetaForm((prev) => ({ ...prev, tags: prev.tags.filter((tid) => tid !== tagId) }))}
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

					<hr className="border-gray-200" />

					<QuizQuestionsBuilder
						questions={localQuestions}
						onChange={setLocalQuestions}
						error={errors.quizQuestions}
					/>

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
							disabled={isBusy}
							className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
						>
							{isBusy ? "Enregistrement…" : "Enregistrer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
