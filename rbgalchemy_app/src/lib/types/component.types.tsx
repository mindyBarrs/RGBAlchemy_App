export interface CircleProps {
	color: number[];
}

export interface GameBoardProps {
	gridHeight: number;
	gridWidth: number;
	targetColor: number[];
	moveCount: number;
	reload: boolean;
	moveMade?: () => void;
	reloaded?: () => void;
	win?: () => void;
	onMove: (rowId: number, colId: number) => void;
	onGameEnd: () => void;
}

export interface SquareProps {
	color: number[];
	selected?: boolean;
}

export interface SourceProps {
	rowId: number;
	colId: number;
	color?: number[];
	isClickable: boolean;
	handleSourceClick: (rowId: number, colId: number) => void;
	handleSourceDrop: (color: number[], rowId: number, colId: number) => void;
}

export interface TilesGridProps {
	colId: number;
	rowId: number;
	color?: number[];
	isClosest: boolean;
	isDraggable: boolean;
}
