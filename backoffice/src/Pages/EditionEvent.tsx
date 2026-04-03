import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetRessourceStatuses, useGetRessourceConfidentialityTypes } from "../hooks/useRessource";
import { useGetEventByRessource, useUpdateEvent } from "../hooks/useEvent";
import type { ReturnRessourceDto } from "../Types/RessourceTypes";

type FormData = {
	title: string;
	description: string;
	status_id: string;
	confidentiality_type_id: string;
	tags: string;
	is_virtual: boolean;
	date_start: string;
	date_end: string;
	event_link: string;
	location: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

function toDatetimeLocal(iso: string): string {
	if (!iso) return "";
	return iso.slice(0, 16);
}

export default function EditionEvent({ ressource }: { ressource: ReturnRessourceDto }) {
	const navigate = useNavigate();
	const { mutate: updateEvent, isPending } = useUpdateEvent();
	const { data: statuses = [] } = useGetRessourceStatuses();
	const { data: confidentialityTypes = [] } = useGetRessourceConfidentialityTypes();
	const { data: event, isLoading: isLoadingEvent } = useGetEventByRessource(ressource.id);

	const [formData, setFormData] = useState<FormData>({
		title: ressource.title ?? "",
		description: ressource.description ?? "",
		status_id: ressource.status?.id ?? "",
		confidentiality_type_id: ressource.confidentiality_type?.id ?? "",
		tags: ressource.tags?.map((t) => t.label ?? t.id).join(", ") ?? "",
		is_virtual: false,
		date_start: "",
		date_end: "",
		event_link: "",
		location: "",
	});
	const [initialized, setInitialized] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	if (!initialized && event) {
		setFormData((prev) => ({
			...prev,
			is_virtual: event.is_virtual,
			date_start: toDatetimeLocal(event.date_start),
			date_end: toDatetimeLocal(event.date_end),
			event_link: event.event_link ?? "",
			location: event.location ?? "",
		}));
		setInitialized(true);
	}

	const validate = (): boolean => {
		const next: FormErrors = {};
		if (!formData.title.trim()) next.title = "Le titre est requis.";
		if (!formData.status_id) next.status_id = "Le statut est requis.";
		if (!formData.confidentiality_type_id) next.confidentiality_type_id = "La confidentialité est requise.";
		if (!formData.date_start) next.date_start = "La date de début est requise.";
		if (!formData.date_end) next.date_end = "La date de fin est requise.";
		if (formData.date_start && formData.date_end && formData.date_start >= formData.date_end) {
			next.date_end = "La date de fin doit être après la date de début.";
		}
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		if (!validate() || !event) return;

		updateEvent(
			{
				eventId: event.id,
				params: {
					id: event.id,
					is_virtual: formData.is_virtual,
					date_start: new Date(formData.date_start).toISOString(),
					date_end: new Date(formData.date_end).toISOString(),
					event_link: formData.event_link || null,
					location: formData.location || null,
					ressource_id: ressource.id,
				},
			},
			{
				onSuccess: () => navigate("/gestion-ressource"),
				onError: () => setErrors({ general: "Erreur lors de la mise à jour de l'événement." }),
			},
		);
	};

	if (isLoadingEvent) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chargement…</div>
		);
	}

	if (!event) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">Événement introuvable pour cette ressource.</div>
		);
	}

	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 mb-6">
				<button onClick={() => navigate("/gestion-ressource")} className="text-gray-400 hover:text-gray-600 transition text-sm">← Retour</button>
				<h2 className="text-xl font-semibold text-gray-800">Modifier un événement</h2>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="title" className="text-sm font-medium text-gray-700">Titre</label>
						<input type="text" id="title" name="title" value={formData.title} onChange={handleChange} disabled className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed" />
						<span className="text-xs text-gray-400">Le titre est géré au niveau de la ressource</span>
					</div>

					<hr className="border-gray-200" />

					<div className="flex items-center gap-3">
						<input type="checkbox" id="is_virtual" name="is_virtual" checked={formData.is_virtual} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
						<label htmlFor="is_virtual" className="text-sm font-medium text-gray-700">Événement virtuel</label>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="date_start" className="text-sm font-medium text-gray-700">Date de début</label>
							<input type="datetime-local" id="date_start" name="date_start" value={formData.date_start} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
							{errors.date_start && <span className="text-red-500 text-xs">{errors.date_start}</span>}
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="date_end" className="text-sm font-medium text-gray-700">Date de fin</label>
							<input type="datetime-local" id="date_end" name="date_end" value={formData.date_end} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
							{errors.date_end && <span className="text-red-500 text-xs">{errors.date_end}</span>}
						</div>
					</div>

					{formData.is_virtual ? (
						<div className="flex flex-col gap-1.5">
							<label htmlFor="event_link" className="text-sm font-medium text-gray-700">Lien de l'événement</label>
							<input type="url" id="event_link" name="event_link" value={formData.event_link} onChange={handleChange} placeholder="https://..." className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
						</div>
					) : (
						<div className="flex flex-col gap-1.5">
							<label htmlFor="location" className="text-sm font-medium text-gray-700">Lieu</label>
							<input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
						</div>
					)}

					{errors.general && (
						<p className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{errors.general}</p>
					)}

					<div className="flex items-center gap-3 pt-2">
						<button type="button" onClick={() => navigate("/gestion-ressource")} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">Annuler</button>
						<button type="submit" disabled={isPending} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition">
							{isPending ? "Mise à jour…" : "Enregistrer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
