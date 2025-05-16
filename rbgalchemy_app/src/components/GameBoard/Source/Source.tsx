import React from "react";

import Circle from "../../BasicShapes/Circle";

import { SourceProps } from "../../../lib/types/component.types";

const Source = ({
	color,
	colId,
	rowId,
	isClickable,
	handleSourceClick,
	handleSourceDrop,
}: SourceProps) => {
	const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		const newColor = event.dataTransfer.getData("text");
		var colorArray = newColor.split(",").map(Number); // text to number[]
		handleSourceDrop(colorArray, rowId, colId);
	};

	return (
		<div
			onDragOver={enableDropping}
			onDrop={handleDrop}
			onClick={() => handleSourceClick(rowId, colId)}
			style={{ cursor: isClickable ? "pointer" : "default" }}
		>
			<Circle color={color ?? []} />
		</div>
	);
};

export default Source;
