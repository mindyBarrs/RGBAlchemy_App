import { CircleProps } from "../../lib/types/component.types";

export const Circle = ({ color }: CircleProps) => {
	return (
		<svg width="50" height="50">
			<circle
				cx="25"
				cy="25"
				r="20"
				fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
			/>
		</svg>
	);
};

export default Circle;
