import { CircleProps } from "../../lib/types/component.types";

export const Circle = ({ color }: CircleProps) => {
	return (
		<svg width="25" height="25">
			<circle
				cx="15"
				cy="15"
				r="10"
				fill={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
			/>
		</svg>
	);
};

export default Circle;
