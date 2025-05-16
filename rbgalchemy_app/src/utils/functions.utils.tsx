import { DELTA_CONST } from "../lib/constants/utils.constants";

export function calculateDelta(target: number[], obtained: number[]): number {
	return (
		DELTA_CONST *
		Math.sqrt(
			(target[0] - obtained[0]) ** 2 +
				(target[1] - obtained[1]) ** 2 +
				(target[2] - obtained[2]) ** 2
		)
	);
}

export const getKey = (rowId: number, colId: number) => {
	return rowId.toString() + "|" + colId.toString();
};
