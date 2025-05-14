import { useGameStore } from "../../zustard/store";

export const InfoPanel = () => {
	const { gameConfig } = useGameStore((state) => state);

	return (
		<div style={{ marginBottom: "1rem" }}>
			<p>User ID: {gameConfig.userId}</p>
			<p>
				Target Color:{" "}
				{`rgb(${gameConfig.targetColor.r}, ${gameConfig.targetColor.g}, ${gameConfig.targetColor.b})`}
			</p>
			<p>Max Moves: {gameConfig.maxMoves}</p>
		</div>
	);
};
