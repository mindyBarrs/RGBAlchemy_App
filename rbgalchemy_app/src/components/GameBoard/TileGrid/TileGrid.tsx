import Square from "../../BasicShapes/Square";

import { TilesGridProps } from "../../../lib/types/component.types";

const TileGrid = ({ color, isClosest, isDraggable }: TilesGridProps) => {
	const drag = (event: React.DragEvent<HTMLDivElement>) => {
		event.dataTransfer.setData("text", color ? color?.toString() : "");
	};

	return (
		<div
			draggable={isDraggable}
			onDragStart={drag}
			style={{ cursor: isDraggable ? "pointer" : "default" }}
		>
			<Square color={color ?? []} selected={isClosest} />
		</div>
	);
};

export default TileGrid;
