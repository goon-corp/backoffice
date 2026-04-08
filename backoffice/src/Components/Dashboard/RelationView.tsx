import { useState, useRef, useEffect, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { NodeObject } from "react-force-graph-2d";
import { useGetTags } from "../../hooks/useTag";
import { useGetRessources } from "../../hooks/useRessource";
import TagMultiSelect from "./TagMultiSelect";

type GraphNodeData = {
	label: string;
	nodeType: "tag" | "ressource";
};

type GraphNode = NodeObject<GraphNodeData>;

const NODE_COLORS: Record<GraphNodeData["nodeType"], string> = {
	tag: "#2563eb",
	ressource: "#6366f1",
};

const NODE_RADIUS: Record<GraphNodeData["nodeType"], number> = {
	tag: 10,
	ressource: 6,
};

export default function RelationView() {
	const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
	const [graphWidth, setGraphWidth] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	const { data: tagsData, isLoading: tagsLoading } = useGetTags();
	const { data: ressourcesData, isLoading: ressourcesLoading } = useGetRessources(
		{ size: 500 },
		{ enabled: selectedTagIds.length > 0 },
	);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver(([entry]) => {
			setGraphWidth(entry.contentRect.width);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const tags = tagsData?.items ?? [];
	const ressources = ressourcesData?.items ?? [];

	const filteredRessources = selectedTagIds.length > 0
		? ressources.filter((r) =>
				r.tags?.some((t) => selectedTagIds.includes(t.id)),
			)
		: [];

	const matchedTagIds = new Set(
		filteredRessources.flatMap((r) => r.tags?.map((t) => t.id) ?? []),
	);

	const graphData = {
		nodes: [
			...tags
				.filter((t) => matchedTagIds.has(t.id))
				.map((t): GraphNode => ({
					id: `tag-${t.id}`,
					label: t.label ?? "—",
					nodeType: "tag",
				})),
			...filteredRessources.map((r): GraphNode => ({
				id: `ressource-${r.id}`,
				label: r.title ?? "Sans titre",
				nodeType: "ressource",
			})),
		],
		links: filteredRessources.flatMap((r) =>
			(r.tags ?? [])
				.filter((t) => matchedTagIds.has(t.id))
				.map((t) => ({
					source: `tag-${t.id}`,
					target: `ressource-${r.id}`,
				})),
		),
	};

	const paintNode = useCallback(
		(node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
			const r = NODE_RADIUS[node.nodeType];
			const fontSize = Math.max(10, 12 / globalScale);

			ctx.beginPath();
			ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI);
			ctx.fillStyle = NODE_COLORS[node.nodeType];
			ctx.fill();

			if (globalScale >= 0.6) {
				ctx.font = `${fontSize}px Arial`;
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillStyle = "#374151";
				const maxLen = 20;
				const text =
					node.label.length > maxLen
						? `${node.label.slice(0, maxLen)}…`
						: node.label;
				ctx.fillText(text, node.x ?? 0, (node.y ?? 0) + r + 2);
			}
		},
		[],
	);

	const isEmpty = selectedTagIds.length === 0;
	const isLoading = tagsLoading || (selectedTagIds.length > 0 && ressourcesLoading);
	const hasNoResults = !isEmpty && !isLoading && filteredRessources.length === 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<TagMultiSelect
					tags={tags}
					selected={selectedTagIds}
					onChange={setSelectedTagIds}
				/>
				{selectedTagIds.length > 0 && !isLoading && (
					<span className="text-sm text-gray-400">
						{filteredRessources.length} ressource{filteredRessources.length !== 1 ? "s" : ""}
						{" · "}
						{matchedTagIds.size} tag{matchedTagIds.size !== 1 ? "s" : ""}
					</span>
				)}
			</div>

			<div
				ref={containerRef}
				className="bg-white rounded-xl border border-gray-200 overflow-hidden"
				style={{ height: 560 }}
			>
				{isEmpty && (
					<div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
						<span className="text-4xl">⬡</span>
						<p className="text-sm">Sélectionnez un ou plusieurs tags pour visualiser les relations.</p>
					</div>
				)}

				{isLoading && (
					<div className="flex items-center justify-center h-full text-gray-400 text-sm">
						Chargement…
					</div>
				)}

				{hasNoResults && (
					<div className="flex items-center justify-center h-full text-gray-400 text-sm">
						Aucune ressource associée aux tags sélectionnés.
					</div>
				)}

				{!isEmpty && !isLoading && !hasNoResults && graphWidth > 0 && (
					<ForceGraph2D
						graphData={graphData}
						width={graphWidth}
						height={560}
						backgroundColor="#ffffff"
						nodeLabel="label"
						nodeCanvasObject={paintNode}
						nodeCanvasObjectMode={() => "replace"}
						linkColor={() => "#e5e7eb"}
						linkWidth={1.5}
						enableNodeDrag
						warmupTicks={60}
						cooldownTicks={100}
					/>
				)}
			</div>

			{!isEmpty && (
				<div className="flex items-center gap-6 text-xs text-gray-500">
					<div className="flex items-center gap-2">
						<span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
						Tag
					</div>
					<div className="flex items-center gap-2">
						<span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
						Ressource
					</div>
				</div>
			)}
		</div>
	);
}
