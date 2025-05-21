import { useEffect, useState } from "react";

import { InfoPanel } from "../components/InfoPanel/InfoPanel";
import GameBoard from "../components/GameBoard/GameBoard";
import Modal from "../components/Modal";

import { initializeGame } from "../api/api";
import { useGameStore } from "../zustard/store";

export const Main = () => {
	const setGameConfig = useGameStore((state) => state.setGameConfig);
	const { gameConfig, movesLeft } = useGameStore((state) => state);

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
	}, []);

	const handleMovePlus = () => {
		setRGBMoveCount((rgbMoveCount: number) => rgbMoveCount + 1);
	};

	useEffect(() => {
		if (movesLeft === 0 && rgbMoveCount === 3) {
			setOpenDialog(true);
		}
	}, [movesLeft]);

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
					reload={reloadGrid}
					moveMade={handleMovePlus}
				/>

				{openDialog && (
					<Modal
						win={win}
						isOpen={openDialog}
						onClose={() => {
							setOpenDialog(false);
							setReloadGrid(true);
							setRGBMoveCount(0);
						}}
						onReload={() => {
							setOpenDialog(false);
							setReloadGrid(true);
							setRGBMoveCount(0);
							setWin(false);
						}}
					/>
				)}
			</div>
		</div>
	);
};
