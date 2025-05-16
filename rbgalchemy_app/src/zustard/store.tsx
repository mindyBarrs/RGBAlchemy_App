import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";

import { GameResponse, GameStore } from "../lib/types/game.types";

import { COLOR } from "../lib/constants/colors.constants";
import { calculateDelta, getKey } from "../utils/functions.utils";

enableMapSet();

export const useGameStore = create<GameStore>()(
	immer((set) => ({
		gameConfig: {
			userId: "",
			maxMoves: 0,
			targetColor: COLOR.DEFAULT_BLACK,
			gameBoardSize: {
				width: 0,
				height: 0,
			},
		},
		movesLeft: 0,
		bestColor: COLOR.DEFAULT_BLACK,
		bestDelta: 0,
		closestIndex: { rowId: 1, colId: 1 },
		delta: calculateDelta(COLOR.DEFAULT_BLACK, COLOR.DEFAULT_BLACK),
		// sourceMap: new Map(),
		tileMap: new Map(),

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
				movesLeft: config.maxMoves,
				bestColor: config.target,
				bestDelta: 0,
			});
		},

		setClosestIndex: (rowId: number, colId: number) => {
			set({
				closestIndex: { rowId, colId },
			});
		},

		setDelta: (d: number) => set({ delta: d }),

		getSourceColor: (
			rowId: number,
			colId: number,
			sourceMap: Map<string, number[]>
		) => {
			let mapKey = getKey(rowId, colId);
			// const state: GameStore = useGameStore.getState();
			const color = sourceMap.get(mapKey);
			return color !== undefined ? color : COLOR.DEFAULT_BLACK;
		},

		// setSourceMap: (key: string, value: number[]) => {
		// 	set((state) => {
		// 		state.sourceMap.set(key, value);
		// 	});
		// },

		getTileColor: (rowId: number, colId: number) => {
			let mapKey = getKey(rowId, colId);
			const state: GameStore = useGameStore.getState();
			const color = state.tileMap.get(mapKey);
			return color !== undefined ? color : COLOR.DEFAULT_BLACK;
		},

		setTileMap: (key: string, value: number[]) => {
			set((state) => {
				state.tileMap.set(key, value);
			});
		},
	}))
);
