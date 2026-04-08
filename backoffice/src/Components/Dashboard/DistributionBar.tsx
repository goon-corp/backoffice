type DistributionBarProps = {
	label: string;
	count: number;
	total: number;
	color: string;
};

export default function DistributionBar({ label, count, total, color }: DistributionBarProps) {
	const pct = total > 0 ? Math.round((count / total) * 100) : 0;

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between text-sm">
				<span className="text-gray-600">{label}</span>
				<span className="font-medium text-gray-800">
					{count}{" "}
					<span className="text-gray-400 font-normal text-xs">({pct}%)</span>
				</span>
			</div>
			<div className="h-2 rounded-full bg-gray-100 overflow-hidden">
				<div
					className={`h-full rounded-full ${color} transition-all`}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}
