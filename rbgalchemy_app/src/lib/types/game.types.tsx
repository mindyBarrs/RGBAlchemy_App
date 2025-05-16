import { SourceProps } from "./component.types";

import { RGB } from "./utils.types";

export interface GameResponse {
	userId: string;
	maxMoves: number;
	width: number;
	height: number;
	target: number[];
}

export interface GameConfig {
	userId: string;
	maxMoves: number;
	targetColor: number[];
	gameBoardSize: {
		width: number;
		height: number;
	};
}

export interface GameStore {
	gameConfig: GameConfig;
	tiles: number[][];
	sources: SourceProps[];
	movesLeft: number;
	bestColor: number[];
	bestDelta: number;
	sourceMap: Map<string, number>;
	tileMap: Map<string, number>;
	closestIndex: { rowId: number; colId: number };
	delta: number;
	setClosestIndex: (
		rowId: number,
		colId: number,
		tileColor: number[],
		targetColor: number[]
	) => void;
	setDelta: (value: number) => void;
	setGameConfig: (config: GameResponse) => void;
	setSourceMap: (key: string, value: number) => void;
	setTileMap: (key: string, value: number) => void;
	resetMaps: (targetColor: number[]) => void;
}
