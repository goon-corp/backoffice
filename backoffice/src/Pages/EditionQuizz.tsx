import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
	useGetRessourceStatuses,
	useGetRessourceConfidentialityTypes,
} from "../hooks/useRessource";
import { useGetQuizzByRessource, useUpdateQuizz } from "../hooks/useQuizz";
import {
	useGetQuizzQuestions,
	useCreateQuizzQuestion,
	useUpdateQuizzQuestion,
	useDeleteQuizzQuestion,
} from "../hooks/useQuizzQuestion";
import { useGetTags } from "../hooks/useTag";
import type { QuizzQuestionInfoDto } from "../Types/QuizzQuestionTypes";

type FormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	tags: string[];
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

type NewQuestion = {
	question: string;
	possible_answers: string;
	correct_answer: string;
};

const emptyQuestion: NewQuestion = {
	question: "",
	possible_answers: "",
	correct_answer: "",
};

export default function EditionQuizz({ id }: { id: string }) {
	const navigate = useNavigate();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: confidentialityTypes = [] } =
		useGetRessourceConfidentialityTypes();
	const { data: allTags = [] } = useGetTags();
	const { data: quizz, isLoading: isLoadingQuizz } =
		useGetQuizzByRessource(id);
	const ressource = quizz?.ressource;

	const { data: allQuestions = [], isLoading: isLoadingQuestions } =
		useGetQuizzQuestions();
	const questions = useMemo(
		() => (quizz ? allQuestions.filter((q) => q.quizz_id === quizz.id) : []),
		[allQuestions, quizz],
	);

	const { mutate: updateQuizz, isPending } = useUpdateQuizz();
	const { mutate: createQuestion } = useCreateQuizzQuestion();
	const { mutate: updateQuestion } = useUpdateQuizzQuestion();
	const { mutate: deleteQuestion } = useDeleteQuizzQuestion();

	const [formData, setFormData] = useState<FormData>({
		title: "",
		description: "",
		status_id: "",
		confidentiality_type_id: "",
		tags: [],
	});
	const [initialized, setInitialized] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [newQ, setNewQ] = useState<NewQuestion>(emptyQuestion);
	const [editingQ, setEditingQ] = useState<
		({ id: string } & NewQuestion) | null
	>(null);

	if (!initialized && ressource) {
		setFormData({
			title: ressource.title ?? "",
			description: ressource.description ?? "",
			status_id: ressource.status?.id ?? "",
			confidentiality_type_id: ressource.confidentiality_type?.id ?? "",
			tags:
				ressource.tags?.map((t: { id: string; label: string }) => t.id) ?? [],
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
		if (!validate() || !quizz || !ressource) return;

		updateQuizz(
			{
				id: quizz.id,
				params: {
					ressource: {
						title: formData.title,
						description: formData.description,
						tags: formData.tags,
						status_id: formData.status_id,
						confidentiality_type_id: formData.confidentiality_type_id,
						type_id: ressource.type.id,
					},
					options: questions.map((q) => ({
						id: q.id,
						option:
							editingQ?.id === q.id
								? editingQ.question
								: (q.question ?? ""),
					})),
				},
			},
			{
				onSuccess: () => navigate("/gestion-ressource"),
				onError: () =>
					setErrors({
						general: "Erreur lors de la mise à jour du quiz.",
					}),
			},
		);
	};

	const handleAddQuestion = () => {
		if (!newQ.question.trim() || !quizz) return;
		createQuestion(
			{
				question: newQ.question,
				possible_answers: newQ.possible_answers || null,
				correct_answer: newQ.correct_answer || null,
				quizz_id: quizz.id,
			},
			{ onSuccess: () => setNewQ(emptyQuestion) },
		);
	};

	const handleSaveQuestion = (q: QuizzQuestionInfoDto) => {
		if (!editingQ) return;
		updateQuestion(
			{
				id: q.id,
				params: {
					question: editingQ.question || null,
					possible_answers: editingQ.possible_answers || null,
					correct_answer: editingQ.correct_answer || null,
				},
			},
			{ onSuccess: () => setEditingQ(null) },
		);
	};

	const handleDeleteQuestion = (questionId: string) => {
		deleteQuestion(questionId);
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
					Modifier un quiz
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
					Questions du quiz
				</h3>

				<div className="flex flex-col gap-4">
					{questions.map((q, idx) => (
						<div
							key={q.id}
							className="border border-gray-100 rounded-lg p-4"
						>
							{editingQ?.id === q.id ? (
								<div className="flex flex-col gap-3">
									<input
										type="text"
										value={editingQ.question}
										onChange={(e) =>
											setEditingQ({
												...editingQ,
												question: e.target.value,
											})
										}
										placeholder="Question"
										className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
									<input
										type="text"
										value={editingQ.possible_answers}
										onChange={(e) =>
											setEditingQ({
												...editingQ,
												possible_answers: e.target.value,
											})
										}
										placeholder="Réponses possibles (séparées par des virgules)"
										className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
									<input
										type="text"
										value={editingQ.correct_answer}
										onChange={(e) =>
											setEditingQ({
												...editingQ,
												correct_answer: e.target.value,
											})
										}
										placeholder="Bonne réponse"
										className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
									/>
									<div className="flex gap-2">
										<button
											onClick={() => handleSaveQuestion(q)}
											className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
										>
											OK
										</button>
										<button
											onClick={() => setEditingQ(null)}
											className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
										>
											Annuler
										</button>
									</div>
								</div>
							) : (
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-800">
											{idx + 1}. {q.question ?? "—"}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Réponses : {q.possible_answers ?? "—"}
										</p>
										<p className="text-xs text-green-600 mt-0.5">
											Correcte : {q.correct_answer ?? "—"}
										</p>
									</div>
									<div className="flex gap-1">
										<button
											onClick={() =>
												setEditingQ({
													id: q.id,
													question: q.question ?? "",
													possible_answers:
														q.possible_answers ?? "",
													correct_answer:
														q.correct_answer ?? "",
												})
											}
											className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
											title="Modifier"
										>
											✏️
										</button>
										<button
											onClick={() =>
												handleDeleteQuestion(q.id)
											}
											className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
											title="Supprimer"
										>
											🗑️
										</button>
									</div>
								</div>
							)}
						</div>
					))}

					{questions.length === 0 && (
						<p className="text-sm text-gray-400">
							Aucune question pour le moment.
						</p>
					)}

					<div className="border-t border-gray-100 pt-4">
						<p className="text-xs font-medium text-gray-500 mb-2">
							Ajouter une question
						</p>
						<div className="flex flex-col gap-2">
							<input
								type="text"
								value={newQ.question}
								onChange={(e) =>
									setNewQ({ ...newQ, question: e.target.value })
								}
								placeholder="Question"
								className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
							<input
								type="text"
								value={newQ.possible_answers}
								onChange={(e) =>
									setNewQ({
										...newQ,
										possible_answers: e.target.value,
									})
								}
								placeholder="Réponses possibles (séparées par des virgules)"
								className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
							<input
								type="text"
								value={newQ.correct_answer}
								onChange={(e) =>
									setNewQ({
										...newQ,
										correct_answer: e.target.value,
									})
								}
								placeholder="Bonne réponse"
								className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
							/>
							<button
								type="button"
								onClick={handleAddQuestion}
								className="self-start px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
							>
								Ajouter
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
