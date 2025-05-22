export interface CircleProps {
	color: number[];
}

export interface GameBoardProps {
	gridHeight: number;
	gridWidth: number;
	targetColor: number[];
	tileMap: Map<string, number[]>;
	rgbMoveCount: number;
	reload: boolean;
	moveMade: () => void;
	win: () => void;
	setTileMap: (tileMap: Map<string, number[]>) => void;
}

export interface InfoPanelProps {
	tileMap: Map<string, number[]>;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onReload: () => void;
	win?: boolean;
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
	color?: number[];
	isClosest: boolean;
	isDraggable: boolean;
}
