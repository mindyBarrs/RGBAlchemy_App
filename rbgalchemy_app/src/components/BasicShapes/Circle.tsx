import { CircleProps } from "../../lib/types/component.types";

export const Circle = ({ color }: CircleProps) => {
	return (
		<svg width="100" height="100">
			<circle
				cx="50"
				cy="50"
				r="40"
				fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
			/>
		</svg>
	);
};

export default Circle;
