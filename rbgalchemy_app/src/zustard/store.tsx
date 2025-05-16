import { create } from "zustand";

import { GameResponse, GameStore } from "../lib/types/game.types";
import { RGB } from "../lib/types/utils.types";
import { COLOR } from "../lib/constants/colors.constants";

const DELTA_CONST = 1; // Define DELTA_CONST with an appropriate value

export const useGameStore = create<GameStore>((set) => ({
	gameConfig: {
		userId: "",
		maxMoves: 0,
		targetColor: COLOR.DEFAULT_BLACK,
		gameBoardSize: {
			width: 0,
			height: 0,
		},
	},
	tiles: [],
	sources: [],
	movesLeft: 0,
	bestColor: COLOR.DEFAULT_BLACK,
	bestDelta: 0,
	sourceMap: new Map<string, number>(),
	tileMap: new Map<string, number>(),
	closestIndex: { rowId: 1, colId: 1 },
	delta: calculateDelta(COLOR.DEFAULT_BLACK, COLOR.DEFAULT_BLACK),

	setGameConfig: (config: GameResponse) => {
		set({
			gameConfig: {
				userId: config.userId,
				gameBoardSize: {
					width: config.width,
					height: config.height,
				},
				targetColor: config.target,
				maxMoves: config.maxMoves,
			},
			tiles: Array(config.height)
				.fill(null)
				.map(() => Array(config.width).fill([COLOR.DEFAULT_BLACK])),
			movesLeft: config.maxMoves,
			bestColor: config.target,
			bestDelta: 0,
		});
	},

	setSourceMap: (key: string, value: number) => {
		const sourceMap = new Map<string, number>(get().sourceMap);
		sourceMap.set(key, value);
		set({ sourceMap });
	},

	setTileMap: (key: string, value: number) => {
		const tileMap = new Map<string, number>(get().tileMap);
		tileMap.set(key, value);
		set({ tileMap });
	},

	resetMaps: (targetColor: number[]) => {
		set({
			sourceMap: new Map(),
			tileMap: new Map(),
			closestIndex: { rowId: 1, colId: 1 },
			delta: calculateDelta(targetColor, COLOR.DEFAULT_BLACK),
		});
	},

	setClosestIndex: (
		rowId: number,
		colId: number,
		tileColor: number[],
		targetColor: number[]
	) => {
		const { closestIndex } = get();
		const oldColor =
			get().tileMap.get(`${closestIndex.rowId}|${closestIndex.colId}`) ||
			COLOR.DEFAULT_BLACK;

		if (rowId === closestIndex.rowId && colId === closestIndex.colId) return;

		const newDelta = calculateDelta(targetColor, tileColor);
		const oldDelta = calculateDelta(targetColor, oldColor);

		if (newDelta < oldDelta) {
			set({ closestIndex: { rowId, colId }, delta: newDelta });
		}
	},

	setDelta: (d: number) => set({ delta: d }),
}));

function get() {
	return useGameStore.getState();
}

function calculateDelta(target: number[], obtained: number[]): number {
	return (
		DELTA_CONST *
		Math.sqrt(
			(target[0] - obtained[0]) ** 2 +
				(target[1] - obtained[1]) ** 2 +
				(target[2] - obtained[2]) ** 2
		)
	);
}
