import { useGameStore } from "../../zustard/store";
import Square from "../BasicShapes/Square";

import { COLOR } from "../../lib/constants/colors.constants";

export const InfoPanel = () => {
	const { closestIndex, delta, gameConfig, movesLeft, getTileColor } =
		useGameStore((state) => state);

	const convertedDelta = () => {
		return (delta * 100).toFixed(2);
	};

	return (
		<div style={{ marginBottom: "1rem" }}>
			<p>User ID: {gameConfig.userId}</p>
			<p>
				Target Color: <Square color={gameConfig.targetColor} />
			</p>
			<p>Max Moves: {movesLeft}</p>

			<div className="mb-6 h-4">
				Closest color:
				<div className="inline relative top-1/2 ml-2">
					<Square
						color={
							getTileColor(closestIndex.rowId, closestIndex.colId) ||
							COLOR.DEFAULT_BLACK
						}
					/>
				</div>
				{"Δ=" + convertedDelta() + "%"}
			</div>
		</div>
	);
};
