type StatCardProps = {
	label: string;
	value: string | number;
	sub?: string;
	alert?: boolean;
};

export default function StatCard({ label, value, sub, alert = false }: StatCardProps) {
	return (
		<div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1">
			<span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
				{label}
			</span>
			<span className={`text-3xl font-bold ${alert ? "text-red-600" : "text-gray-800"}`}>
				{value}
			</span>
			{sub && <span className="text-xs text-gray-400">{sub}</span>}
		</div>
	);
}
