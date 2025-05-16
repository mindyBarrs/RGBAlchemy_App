import { SourceProps } from "./component.types";

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
	movesLeft: number;
	bestColor: number[];
	bestDelta: number;
	closestIndex: { rowId: number; colId: number };
	delta: number;
	tileMap: Map<string, number[]>;
	// sourceMap: Map<string, number[]>;

	setClosestIndex: (rowId: number, colId: number) => void;
	setDelta: (value: number) => void;
	setGameConfig: (config: GameResponse) => void;
	// setSourceMap: (key: string, value: number[]) => void;
	getSourceColor: (
		rowId: number,
		colId: number,
		sourceMap: Map<string, number[]>
	) => number[];
	getTileColor: (rowId: number, colId: number) => number[];
	setTileMap: (key: string, value: number[]) => void;
}
