import type { ReturnRessourceDto } from "../../Types/RessourceTypes";
import StatCard from "./StatCard";
import DistributionBar from "./DistributionBar";

const TYPE_COLORS = [
	"bg-blue-500",
	"bg-indigo-500",
	"bg-violet-500",
	"bg-sky-500",
	"bg-teal-500",
];

type KpiViewProps = {
	totalUsers: number;
	totalRessources: number;
	totalComments: number;
	deletedComments: number;
	totalReports: number;
	pendingReports: number;
	byStatus: Record<string, number>;
	byType: Record<string, number>;
	ressourcesCount: number;
	mostLiked: ReturnRessourceDto | null;
};

export default function KpiView({
	totalUsers,
	totalRessources,
	totalComments,
	deletedComments,
	totalReports,
	pendingReports,
	byStatus,
	byType,
	ressourcesCount,
	mostLiked,
}: KpiViewProps) {
	return (
		<>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard label="Utilisateurs" value={totalUsers} />
				<StatCard label="Ressources" value={totalRessources} />
				<StatCard
					label="Commentaires"
					value={totalComments}
					sub={
						deletedComments > 0
							? `dont ${deletedComments} supprimé${deletedComments > 1 ? "s" : ""}`
							: undefined
					}
				/>
				<StatCard
					label="Signalements en attente"
					value={pendingReports}
					sub={`${totalReports} au total`}
					alert={pendingReports > 0}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
					<h3 className="text-sm font-semibold text-gray-700">Ressources par statut</h3>
					{Object.entries(byStatus).length === 0 ? (
						<p className="text-sm text-gray-400">Aucune donnée</p>
					) : (
						<div className="flex flex-col gap-3">
							{Object.entries(byStatus).map(([label, count]) => (
								<DistributionBar
									key={label}
									label={label}
									count={count}
									total={ressourcesCount}
									color="bg-blue-500"
								/>
							))}
						</div>
					)}
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
					<h3 className="text-sm font-semibold text-gray-700">Ressources par type</h3>
					{Object.entries(byType).length === 0 ? (
						<p className="text-sm text-gray-400">Aucune donnée</p>
					) : (
						<div className="flex flex-col gap-3">
							{Object.entries(byType).map(([label, count], i) => (
								<DistributionBar
									key={label}
									label={label}
									count={count}
									total={ressourcesCount}
									color={TYPE_COLORS[i % TYPE_COLORS.length]}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{mostLiked && (
				<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
					<span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
						Ressource la plus likée
					</span>
					<span className="text-lg font-semibold text-gray-800">
						{mostLiked.title ?? "Sans titre"}
					</span>
					<div className="flex items-center gap-4 text-sm text-gray-500">
						<span>{mostLiked.like_count} likes</span>
						<span>{mostLiked.favorite_count} favoris</span>
						{mostLiked.type?.label && (
							<span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
								{mostLiked.type.label}
							</span>
						)}
					</div>
				</div>
			)}
		</>
	);
}
