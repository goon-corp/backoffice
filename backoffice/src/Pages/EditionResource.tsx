import { useParams, useSearchParams } from "react-router";
import { useGetRessource } from "../hooks/useRessource";
import EditionArticle from "./EditionArticle";
import EditionPoll from "./EditionPoll";
import EditionEvent from "./EditionEvent";
import EditionQuizz from "./EditionQuizz";

// function resolveType(label: string | null | undefined): string | null {
// 	if (!label) return null;
// 	const l = label.toLowerCase();
// 	if (l.includes("article")) return "article";
// 	if (l.includes("sondage") || l.includes("poll")) return "poll";
// 	if (l.includes("événement") || l.includes("evenement") || l.includes("event"))
// 		return "event";
// 	if (l.includes("quiz") || l.includes("quizz")) return "quizz";
// 	return null;
// }

interface EditionResourceProps {
	resourcetype: "article" | "poll" | "quizz" | "event";
}

export default function EditionResource(props: EditionResourceProps) {
	const { id } = useParams<{ id: string }>();
	const { data: ressource, isLoading, isError } = useGetRessource(id!);
	const [searchParams] = useSearchParams();
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	if (isError || !ressource) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Erreur lors de la récupération de la ressource.
			</div>
		);
	}

	// const type = resolveType(ressource.type?.label);

	switch (searchParams.get("type")) {
		case "Article":
			return <EditionArticle ressource={ressource} />;
		case "Poll":
			return <EditionPoll ressource={ressource} />;
		case "Event":
			return <EditionEvent ressource={ressource} />;
		case "Quizz":
			return <EditionQuizz ressource={ressource} />;
		default:
			return (
				<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
					Type de ressource non supporté : {ressource.type?.label ?? "inconnu"}
				</div>
			);
	}
}
