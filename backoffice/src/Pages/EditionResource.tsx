import { useParams, useSearchParams } from "react-router";
import EditionArticle from "./EditionArticle";
import EditionPoll from "./EditionPoll";
import EditionEvent from "./EditionEvent";
import EditionQuizz from "./EditionQuizz";

export default function EditionResource() {
	const { id } = useParams<{ id: string }>();
	const [searchParams] = useSearchParams();

	if (!id) {
		return (
			<div className="flex items-center justify-center h-64 text-red-500 text-sm">
				Identifiant de ressource manquant.
			</div>
		);
	}

	switch (searchParams.get("type")) {
		case "Article":
			return <EditionArticle id={id} />;
		case "Sondage":
			return <EditionPoll id={id} />;
		case "Événement":
			return <EditionEvent id={id} />;
		case "Quizz":
			return <EditionQuizz id={id} />;
		default:
			return (
				<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
					Type de ressource non supporté.
				</div>
			);
	}
}
