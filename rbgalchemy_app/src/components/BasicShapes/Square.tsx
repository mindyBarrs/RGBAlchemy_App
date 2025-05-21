import { SquareProps } from "../../lib/types/component.types";

export const Square = ({ color, selected }: SquareProps) => {
	return (
		<svg width="50" height="50">
			<rect
				x="10"
				y="10"
				width="80"
				height="80"
				fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
				stroke={selected ? "black" : "none"}
				strokeWidth={selected ? 5 : 0}
			/>
		</svg>
	);
};
export default Square;
