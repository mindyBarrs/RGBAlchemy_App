import { SquareProps } from "../../lib/types/component.types";

export const Square = ({ color }: SquareProps) => {
	return (
		<svg width="25" height="25">
			<rect
				x="5"
				y="5"
				width="80"
				height="80"
				fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
			/>
		</svg>
	);
};
export default Square;
