import { SquareProps } from "../../lib/types/component.types";

export const Square = ({ color, selected }: SquareProps) => {
	return (
		<svg width="25" height="25">
			<rect
				x="5"
				y="5"
				width="18"
				height="18"
				fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
				stroke={selected ? "black" : "none"}
				strokeWidth={selected ? 5 : 0}
			/>
		</svg>
	);
};
export default Square;
