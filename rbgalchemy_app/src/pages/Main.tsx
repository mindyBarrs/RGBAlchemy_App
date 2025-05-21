import { useEffect, useState } from "react";

import GameBoard from "../components/GameBoard/GameBoard";
import InfoPanel from "../components/InfoPanel/InfoPanel";
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
		fetchGameConfig();
	}, []);

	const handleMovePlus = () => {
		setRGBMoveCount((rgbMoveCount: number) => rgbMoveCount + 1);
	};

	useEffect(() => {
		if (movesLeft === 0 && rgbMoveCount === 3) {
			setOpenDialog(true);
		}
	}, [movesLeft, rgbMoveCount]);

	// Fetch game configuration from API
	const fetchGameConfig = async () => {
		try {
			const response = await initializeGame();

			setGameConfig(response);
		} catch (error) {
			console.error("Error fetching game config:", error);
		}
	};

	const handleReload = () => {
		setOpenDialog(false);
		setReloadGrid(true);
		setRGBMoveCount(0);
		setWin(false);
	};

	const handleWin = () => {
		setOpenDialog(true);
		setWin(true);
	};

	return (
		<div>
			<h1>RGB Alchemy Game</h1>

			<div className="game-container">
				<InfoPanel />

				<GameBoard
					gridHeight={gameConfig.gameBoardSize.height}
					gridWidth={gameConfig.gameBoardSize.width}
					targetColor={gameConfig.targetColor}
					rgbMoveCount={rgbMoveCount}
					reload={reloadGrid}
					moveMade={handleMovePlus}
					win={handleWin}
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
						onReload={handleReload}
					/>
				)}
			</div>
		</div>
	);
};
