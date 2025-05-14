export interface GameResponse {
	userId: string;
	maxMoves: number;
	width: number;
	height: number;
	target: RGB;
}

export interface GameConfig {
	userId: string;
	maxMoves: number;
	targetColor: RGB;
	gameBoardSize: {
		width: number;
		height: number;
	};
}

export interface GameStore {
	gameConfig: GameConfig;
	tiles: RGB[][];
	sources: Source[];
	movesLeft: number;
	bestColor: RGB | null;
	bestDelta: number;
	setSourceColor: (index: number, color: RGB) => void;
	setGameConfig: (config: GameResponse) => void;
	mixColorAt: (x: number, y: number, sourceIndex: number) => void;
	generateSources: () => void;
	// resetGame: () => void;
}

export interface RGB {
	r: number;
	g: number;
	b: number;
}

type SourcePosition = "top" | "bottom" | "left" | "right";

export interface Source {
	id: string;
	position: SourcePosition;
	index: number;
	color: RGB;
}
