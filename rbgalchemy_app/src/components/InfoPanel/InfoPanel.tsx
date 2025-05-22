import { useGameStore } from "../../zustard/store";
import Square from "../BasicShapes/Square";

import { COLOR } from "../../lib/constants/colors.constants";
import { InfoPanelProps } from "../../lib/types/component.types";

export const InfoPanel = ({ tileMap }: InfoPanelProps) => {
	const { closestIndex, delta, gameConfig, movesLeft, getTileColor } =
		useGameStore((state) => state);

	const convertedDelta = () => {
		return (delta * 100).toFixed(2);
	};

	return (
		<div className="info-panel">
			<div className="flex-column">
				<div className="flex-row">
					<p className="strong">User ID:</p>
					<p>{gameConfig.userId}</p>
				</div>

				<div className="flex-row">
					<p className="strong">Target Color: </p>
					<p>
						<Square color={gameConfig.targetColor} />
					</p>
				</div>

				<div className="flex-row">
					<p className="strong">Max Moves:</p>
					<p>{movesLeft}</p>
				</div>

				<div className="flex-row">
					<p className="strong">Closest color:</p>

					<div className="flex-column" style={{ alignItems: "end" }}>
						<Square
							color={
								getTileColor(closestIndex.rowId, closestIndex.colId, tileMap) ||
								COLOR.DEFAULT_BLACK
							}
						/>

						{"Δ=" + convertedDelta() + "%"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoPanel;
