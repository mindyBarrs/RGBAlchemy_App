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
			<p>
				<span className="strong">User ID:</span> {gameConfig.userId}
			</p>
			<p className="target-color">
				<span className="strong">Target Color: </span>

				<div style={{ marginLeft: "5px" }}>
					<Square color={gameConfig.targetColor} />
				</div>
			</p>
			<p>
				<span className="strong">Max Moves:</span> {movesLeft}
			</p>

			<div className="closest-color">
				<span className="strong">Closest color:</span>
				<div className="flex-column">
					<Square
						color={
							getTileColor(closestIndex.rowId, closestIndex.colId) ||
							COLOR.DEFAULT_BLACK
						}
					/>

					{"Δ=" + convertedDelta() + "%"}
				</div>
			</div>
		</div>
	);
};

export default InfoPanel;
