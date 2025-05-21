export interface CircleProps {
	color: number[];
}

export interface GameBoardProps {
	gridHeight: number;
	gridWidth: number;
	targetColor: number[];
	rgbMoveCount: number;
	reload: boolean;
	moveMade: () => void;
	win?: () => void;
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
	colId: number;
	rowId: number;
	color?: number[];
	isClosest: boolean;
	isDraggable: boolean;
}
