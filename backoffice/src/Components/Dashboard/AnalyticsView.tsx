import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import type { ReturnRessourceDto } from "../../Types/RessourceTypes";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DONUT_COLORS = ["#2563eb", "#6366f1", "#8b5cf6", "#0ea5e9", "#14b8a6", "#f59e0b"];

const DONUT_OPTIONS = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "bottom" as const,
			labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
		},
	},
};

const BAR_OPTIONS = {
	responsive: true,
	maintainAspectRatio: false,
	indexAxis: "y" as const,
	plugins: { legend: { display: false } },
	scales: {
		x: { grid: { color: "#f3f4f6" }, ticks: { font: { size: 12 } } },
		y: { grid: { display: false }, ticks: { font: { size: 12 } } },
	},
};

type AnalyticsViewProps = {
	byStatus: Record<string, number>;
	byType: Record<string, number>;
	top5Liked: ReturnRessourceDto[];
};

export default function AnalyticsView({ byStatus, byType, top5Liked }: AnalyticsViewProps) {
	const statusChartData = {
		labels: Object.keys(byStatus),
		datasets: [{
			data: Object.values(byStatus),
			backgroundColor: DONUT_COLORS.slice(0, Object.keys(byStatus).length),
			borderWidth: 0,
		}],
	};

	const typeChartData = {
		labels: Object.keys(byType),
		datasets: [{
			data: Object.values(byType),
			backgroundColor: DONUT_COLORS.slice(0, Object.keys(byType).length),
			borderWidth: 0,
		}],
	};

	const top5ChartData = {
		labels: top5Liked.map((r) => r.title ?? "Sans titre"),
		datasets: [{
			data: top5Liked.map((r) => r.like_count),
			backgroundColor: "#2563eb",
			borderRadius: 6,
		}],
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
				<h3 className="text-sm font-semibold text-gray-700">Ressources par statut</h3>
				{Object.keys(byStatus).length === 0 ? (
					<p className="text-sm text-gray-400">Aucune donnée</p>
				) : (
					<div className="h-56">
						<Doughnut data={statusChartData} options={DONUT_OPTIONS} />
					</div>
				)}
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
				<h3 className="text-sm font-semibold text-gray-700">Ressources par type</h3>
				{Object.keys(byType).length === 0 ? (
					<p className="text-sm text-gray-400">Aucune donnée</p>
				) : (
					<div className="h-56">
						<Doughnut data={typeChartData} options={DONUT_OPTIONS} />
					</div>
				)}
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 lg:col-span-2">
				<h3 className="text-sm font-semibold text-gray-700">Top 5 ressources les plus likées</h3>
				{top5Liked.length === 0 ? (
					<p className="text-sm text-gray-400">Aucune donnée</p>
				) : (
					<div className="h-56">
						<Bar data={top5ChartData} options={BAR_OPTIONS} />
					</div>
				)}
			</div>
		</div>
	);
}
