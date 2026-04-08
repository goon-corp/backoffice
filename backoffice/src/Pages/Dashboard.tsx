import { useState } from "react";
import { useGetUsers } from "../hooks/useUser";
import { useGetRessources } from "../hooks/useRessource";
import { useGetReports } from "../hooks/useReport";
import { useGetComments } from "../hooks/useComment";
import KpiView from "../Components/Dashboard/KpiView";
import AnalyticsView from "../Components/Dashboard/AnalyticsView";
import RelationView from "../Components/Dashboard/RelationView";

type Tab = "kpi" | "analytics" | "relation";

export default function Dashboard() {
	const [tab, setTab] = useState<Tab>("kpi");

	const { data: usersData, isLoading: usersLoading } = useGetUsers();
	const { data: ressourcesData, isLoading: ressourcesLoading } = useGetRessources({ size: 200 });
	const { data: reportsData, isLoading: reportsLoading } = useGetReports();
	const { data: comments, isLoading: commentsLoading } = useGetComments();

	const isLoading = usersLoading || ressourcesLoading || reportsLoading || commentsLoading;

	const ressources = ressourcesData?.items ?? [];

	const byStatus = ressources.reduce<Record<string, number>>((acc, r) => {
		const label = r.status?.label ?? "Inconnu";
		acc[label] = (acc[label] ?? 0) + 1;
		return acc;
	}, {});

	const byType = ressources.reduce<Record<string, number>>((acc, r) => {
		const label = r.type?.label ?? "Inconnu";
		acc[label] = (acc[label] ?? 0) + 1;
		return acc;
	}, {});

	const mostLiked = ressources.reduce<(typeof ressources)[0] | null>(
		(best, r) => (!best || r.like_count > best.like_count ? r : best),
		null,
	);

	const top5Liked = [...ressources]
		.sort((a, b) => b.like_count - a.like_count)
		.slice(0, 5);

	const totalComments = comments?.length ?? 0;
	const deletedComments = comments?.filter((c) => c.deletion_time !== null).length ?? 0;
	const pendingReports = reportsData?.items.filter((r) => !r.is_checked_by_moderator).length ?? 0;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-gray-400 text-sm">
				Chargement…
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="flex items-center justify-end">
				<div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
					<button
						onClick={() => setTab("kpi")}
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
							tab === "kpi"
								? "bg-white text-gray-800 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						KPI
					</button>
					<button
						onClick={() => setTab("analytics")}
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
							tab === "analytics"
								? "bg-white text-gray-800 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Analytics
					</button>
					<button
						onClick={() => setTab("relation")}
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
							tab === "relation"
								? "bg-white text-gray-800 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						Relation
					</button>
				</div>
			</div>

			{tab === "kpi" && (
				<KpiView
					totalUsers={usersData?.total_count ?? 0}
					totalRessources={ressourcesData?.total_count ?? 0}
					totalComments={totalComments}
					deletedComments={deletedComments}
					totalReports={reportsData?.total_count ?? 0}
					pendingReports={pendingReports}
					byStatus={byStatus}
					byType={byType}
					ressourcesCount={ressources.length}
					mostLiked={mostLiked}
				/>
			)}

			{tab === "analytics" && (
				<AnalyticsView
					byStatus={byStatus}
					byType={byType}
					top5Liked={top5Liked}
				/>
			)}

			{tab === "relation" && <RelationView />}
		</div>
	);
}
