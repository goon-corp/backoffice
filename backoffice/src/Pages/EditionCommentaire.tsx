import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetComment, useUpdateComment } from "../hooks/useComment";

type FormData = {
	content: string;
	ressource_id: string;
	comment_id: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

export default function EditionCommentaire() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const { data: comment, isLoading } = useGetComment(id!);
	const { mutate: updateComment, isPending } = useUpdateComment();

	const [formData, setFormData] = useState<FormData>({
		content: "",
		ressource_id: "",
		comment_id: "",
	});
	const [initialized, setInitialized] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	if (!initialized && comment) {
		setFormData({
			content: comment.content ?? "",
			ressource_id: comment.ressource_id ?? "",
			comment_id: comment.comment_id ?? "",
		});
		setInitialized(true);
	}

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.content.trim()) next.content = "Le contenu est requis.";
		if (!formData.ressource_id.trim())
			next.ressource_id = "L'ID de la ressource est requis.";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate() || !comment) return;

		updateComment(
			{
				id: comment.id,
				params: {
					content: formData.content,
					ressource_id: formData.ressource_id,
					comment_id: formData.comment_id || null,
				},
			},
			{
				onSuccess: () => navigate("/gestion-commentaire"),
				onError: () =>
					setErrors({
						general: "Erreur lors de la mise à jour du commentaire.",
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

	if (!comment) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Commentaire introuvable.
			</div>
		);
	}

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate("/gestion-commentaire")}
					className="text-gray-400 hover:text-gray-600 transition text-sm"
				>
					← Retour
				</button>
				<h2 className="text-xl font-semibold text-gray-800">
					Modifier un commentaire
				</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="content"
							className="text-sm font-medium text-gray-700"
						>
							Contenu
						</label>
						<textarea
							id="content"
							name="content"
							rows={6}
							value={formData.content}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
						/>
						{errors.content && (
							<span className="text-red-500 text-xs">{errors.content}</span>
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

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="comment_id"
							className="text-sm font-medium text-gray-700"
						>
							ID Commentaire parent (optionnel)
						</label>
						<input
							type="text"
							id="comment_id"
							name="comment_id"
							value={formData.comment_id}
							onChange={handleChange}
							className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
						/>
					</div>

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
							{errors.general}
						</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button
							type="button"
							onClick={() => navigate("/gestion-commentaire")}
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
