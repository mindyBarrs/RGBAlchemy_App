import { create } from "zustand";

import { GameResponse, GameStore, RGB, Source } from "../lib/types/game.types";

export const useGameStore = create<GameStore>((set) => ({
	gameConfig: {
		userId: "",
		maxMoves: 0,
		targetColor: { r: 0, g: 0, b: 0 },
		gameBoardSize: {
			width: 0,
			height: 0,
		},
	},
	tiles: [],
	sources: [],
	movesLeft: 0,
	bestColor: { r: 0, g: 0, b: 0 },
	bestDelta: 0,
	setGameConfig: (config: GameResponse) => {
		const target = config.target;

		set({
			gameConfig: {
				userId: config.userId,
				gameBoardSize: {
					width: config.width,
					height: config.height,
				},
				targetColor: target,
				maxMoves: config.maxMoves,
			},
			tiles: Array(config.height)
				.fill(null)
				.map(() => Array(config.width).fill({ r: 0, g: 0, b: 0 })),
			movesLeft: config.maxMoves,
			bestColor: target,
			bestDelta: 0,
		});

		useGameStore.getState().generateSources();
	},
	setSourceColor: (index: number, color: any) => {
		const sources = [...useGameStore.getState().sources];
		sources[index] = color;
		set({ sources });
	},
	mixColorAt: (x, y, sourceIndex) => {
		const { tiles, sources, gameConfig, movesLeft, bestDelta } =
			useGameStore.getState();
		if (movesLeft <= 0) return;

		const sourceColor = sources[sourceIndex].color;
		const tileColor = tiles[y][x];
		const mixedColor = {
			r: Math.min(255, tileColor.r + sourceColor.r),
			g: Math.min(255, tileColor.g + sourceColor.g),
			b: Math.min(255, tileColor.b + sourceColor.b),
		};

		const newTiles = [...tiles];
		newTiles[y] = [...tiles[y]];
		newTiles[y][x] = mixedColor;

		const delta = calculateDelta(mixedColor, gameConfig.targetColor);

		const newBest =
			delta < bestDelta ? { bestColor: mixedColor, bestDelta: delta } : {};

		set({
			tiles: newTiles,
			movesLeft: movesLeft - 1,
			...newBest,
		});
	},
	generateSources: () => {
		set((state) => {
			const { gameConfig } = state;
			const sources: Source[] = [];

			for (let i = 0; i < gameConfig.gameBoardSize.width; i++) {
				sources.push({
					id: `top-${i}`,
					position: "top",
					index: i,
					color: { r: 0, g: 0, b: 0 },
				});
				sources.push({
					id: `bottom-${i}`,
					position: "bottom",
					index: i,
					color: { r: 0, g: 0, b: 0 },
				});
			}

			for (let i = 0; i < gameConfig.gameBoardSize.height; i++) {
				sources.push({
					id: `left-${i}`,
					position: "left",
					index: i,
					color: { r: 0, g: 0, b: 0 },
				});
				sources.push({
					id: `right-${i}`,
					position: "right",
					index: i,
					color: { r: 0, g: 0, b: 0 },
				});
			}

			return { sources };
		});
	},
}));

function calculateDelta(c1: RGB, c2: RGB) {
	const dr = c1.r - c2.r;
	const dg = c1.g - c2.g;
	const db = c1.b - c2.b;
	return (1 / 255) * (1 / 3) * (dr * dr + dg * dg + db * db);
}

function hexToRgb(targetColor: string): RGB | null {
	if (!/^#([0-9A-F]{3}){1,2}$/i.test(targetColor)) {
		return null;
	}

	let color = targetColor.substring(1);
	if (color.length === 3) {
		color = color
			.split("")
			.map((char) => char + char)
			.join("");
	}

	const num = parseInt(color, 16);
	return {
		r: (num >> 16) & 255,
		g: (num >> 8) & 255,
		b: num & 255,
	};
}
