import { useEffect } from "react";

import { InfoPanel } from "../components/InfoPanel/InforPanel";

import { initializeGame } from "../api/api";
import { useGameStore } from "../zustard/store";
import { GameBoard } from "../components/GameBoard/GameBoard";

export const Main = () => {
	const setGameConfig = useGameStore((state) => state.setGameConfig);

	useEffect(() => {
		// Fetch game configuration from API
		const fetchGameConfig = async () => {
			try {
				const response = await initializeGame();

				setGameConfig(response);
			} catch (error) {
				console.error("Error fetching game config:", error);
			}
		};

		fetchGameConfig();
	}, [setGameConfig]);

	return (
		<div>
			<h1>RGB Alchemy Game</h1>

			<div>
				<InfoPanel />

				<GameBoard />
			</div>
		</div>
	);
};
