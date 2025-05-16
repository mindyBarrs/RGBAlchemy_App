import { useEffect, useState } from "react";

import { InfoPanel } from "../components/InfoPanel/InforPanel";

import { initializeGame } from "../api/api";
import { useGameStore } from "../zustard/store";
import { GameBoard } from "../components/GameBoard/GameBoard";

export const Main = () => {
	const setGameConfig = useGameStore((state) => state.setGameConfig);
	const { gameConfig } = useGameStore((state) => state);

	const [rgbMoveCount, setRGBMoveCount] = useState<number>(0);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [reloadGrid, setReloadGrid] = useState<boolean>(false);
	const [win, setWin] = useState<boolean>(false);

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

	const handleMovePlus = () => {
		setRGBMoveCount((rgbMoveCount: number) => rgbMoveCount + 1);
	};

	useEffect(() => {
		if (gameConfig.maxMoves - rgbMoveCount === 0) {
			setOpenDialog(true);
		}
	}, [rgbMoveCount]);

	return (
		<div>
			<h1>RGB Alchemy Game</h1>

			<div>
				<InfoPanel />

				<GameBoard
					gridHeight={gameConfig.gameBoardSize.height}
					gridWidth={gameConfig.gameBoardSize.width}
					targetColor={gameConfig.targetColor}
					rgbMoveCount={rgbMoveCount}
					reload={false}
					moveMade={handleMovePlus}
					onMove={() => console.log("Move made")}
					onGameEnd={() => console.log("Game ended")}
				/>
			</div>
		</div>
	);
};
