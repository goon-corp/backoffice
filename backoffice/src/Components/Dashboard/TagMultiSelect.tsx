import { useState, useRef, useEffect } from "react";
import type { Tag } from "../../Types/TagTypes";

type TagMultiSelectProps = {
	tags: Tag[];
	selected: string[];
	onChange: (ids: string[]) => void;
};

export default function TagMultiSelect({ tags, selected, onChange }: TagMultiSelectProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const toggle = (id: string) => {
		onChange(
			selected.includes(id)
				? selected.filter((s) => s !== id)
				: [...selected, id],
		);
	};

	const clearAll = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange([]);
	};

	const label =
		selected.length === 0
			? "Sélectionner des tags…"
			: selected.length === 1
				? (tags.find((t) => t.id === selected[0])?.label ?? "1 tag")
				: `${selected.length} tags sélectionnés`;

	return (
		<div ref={ref} className="relative w-80">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-left hover:border-blue-400 focus:outline-none focus:border-blue-500 transition"
			>
				<span className={selected.length === 0 ? "text-gray-400" : "text-gray-800"}>
					{label}
				</span>
				<div className="flex items-center gap-1 shrink-0">
					{selected.length > 0 && (
						<span
							onClick={clearAll}
							className="text-gray-400 hover:text-gray-600 cursor-pointer px-1"
						>
							✕
						</span>
					)}
					<span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
				</div>
			</button>

			{open && (
				<div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
					{tags.length === 0 ? (
						<p className="px-3 py-4 text-sm text-gray-400 text-center">Aucun tag disponible</p>
					) : (
						tags.map((tag) => {
							const checked = selected.includes(tag.id);
							return (
								<label
									key={tag.id}
									className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
								>
									<input
										type="checkbox"
										checked={checked}
										onChange={() => toggle(tag.id)}
										className="accent-blue-600"
									/>
									<span className="text-sm text-gray-700">{tag.label ?? "—"}</span>
								</label>
							);
						})
					)}
				</div>
			)}
		</div>
	);
}
