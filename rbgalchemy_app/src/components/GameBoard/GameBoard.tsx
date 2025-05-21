import { useEffect, useState } from "react";

import TileGrid from "./TileGrid/TileGrid";
import Source from "./Source/Source";

import { GameBoardProps } from "../../lib/types/component.types";
import { COLOR } from "../../lib/constants/colors.constants";

import { getKey, calculateDelta } from "../../utils/functions.utils";

import { useGameStore } from "../../zustard/store";

import "./GameBoard.css";

export const GameBoard = ({
	gridHeight,
	gridWidth,
	targetColor,
	rgbMoveCount,
	reload,
	moveMade,
	win,
}: GameBoardProps) => {
	const {
		closestIndex,
		delta,
		tileMap,
		movesLeft,
		setDelta,
		setClosestIndex,
		getSourceColor,
		getTileColor,
		setTileMap,
		updateMaxMoves,
	} = useGameStore();

	const [sourceMap, setSourceMap] = useState<Map<string, number[]>>(new Map());

	// Reset when reload is true
	useEffect(() => {
		setSourceMap(new Map<string, number[]>());
		setClosestIndex(1, 1);
		setDelta(calculateDelta(targetColor, COLOR.DEFAULT_BLACK));
	}, [reload, targetColor]);

	const allowTileDrop = rgbMoveCount > 2;
	const sourceClickable = rgbMoveCount < 2;

	const updateSourceMap = (k: string, v: number[]) => {
		setSourceMap(new Map(sourceMap.set(k, v)));
	};

	const updateTileMap = (k: string, v: number[]) => {
		const newMap = new Map(tileMap);
		newMap.set(k, v);

		setTileMap(k, v);
	};

	const verifyClosest = (tileColor: number[], rowId: number, colId: number) => {
		if (rowId === closestIndex.rowId && colId === closestIndex.colId) {
			return;
		}
		const newDelta = calculateDelta(targetColor, tileColor);
		let closestColor = getTileColor(closestIndex.rowId, closestIndex.colId);

		if (closestColor) {
			const oldDelta = calculateDelta(targetColor, closestColor);
			if (newDelta < oldDelta) {
				setClosestIndex(rowId, colId);
				setDelta(newDelta);
			}
		}
	};

	useEffect(() => {
		if (delta < 0.1 && delta > 0) {
			win();
		}
	}, [delta]);

	const createTileRow = (rowId: number) => {
		const gridElements = [];
		for (let i = 1; i < gridWidth; i++) {
			gridElements.push(
				<TileGrid
					key={"tile-" + rowId + "-" + i}
					color={getTileColor(rowId, i)}
					isDraggable={allowTileDrop}
					isClosest={closestIndex.rowId === rowId && closestIndex.colId === i}
				/>
			);
		}
		return gridElements;
	};

	// update Map of corresponding source, with  color
	const fillSource = (rowId: number, colId: number, color: number[]) => {
		let mapKey = getKey(rowId, colId);

		updateSourceMap(mapKey, color);
		updateSourceShinedTiles(rowId, colId);
	};

	/* set Tile color based on all of it's shined sources */
	const setTileColor = (rowId: number, colId: number) => {
		let shineColors = [];
		let newColor: number[] = [0, 0, 0];
		let shineColor;
		// Array of all the sources that effect this tile
		let shinedSource = [];
		// had to modify tsconfig to target es6 to Iterate through keys
		for (let key of sourceMap.keys()) {
			let ids = key.split("|");
			let sourceRow = parseInt(ids[0]);
			let sourceCol = parseInt(ids[1]);

			if (sourceRow === rowId || sourceCol === colId) {
				shinedSource.push({ rowId: sourceRow, colId: sourceCol });
			}
		}
		if (shinedSource.length === 0) {
			return COLOR.DEFAULT_BLACK;
		}
		for (let source of shinedSource) {
			shineColor = COLOR.DEFAULT_BLACK;
			let ratio;
			let distance;
			if (source.rowId === rowId) {
				distance = Math.abs(source.colId - colId);
				ratio = (gridWidth - distance + 1) / (gridWidth + 1);
			} else {
				distance = Math.abs(source.rowId - rowId);
				ratio = (gridHeight - distance + 1) / (gridHeight + 1);
			}
			let sourceColor = getSourceColor(source.rowId, source.colId, sourceMap);
			if (sourceColor) {
				shineColor = [
					sourceColor[0] * ratio,
					sourceColor[1] * ratio,
					sourceColor[2] * ratio,
				];
				shineColors.push(shineColor);
			}
		}
		for (let i = 0; i < shineColors.length; i++) {
			newColor[0] += shineColors[i][0];
			newColor[1] += shineColors[i][1];
			newColor[2] += shineColors[i][2];
		}
		return newColor;
	};

	const updateSourceShinedTiles = (
		sourceRowId: number,
		sourceColId: number
	) => {
		let newColor: number[];
		let mapKey: string;

		if (sourceRowId === 0 || sourceRowId === gridHeight) {
			for (let i = 1; i < gridHeight; i++) {
				newColor = setTileColor(i, sourceColId);
				mapKey = getKey(i, sourceColId);
				updateTileMap(mapKey, newColor);
				verifyClosest(newColor, i, sourceColId);
			}
		} else {
			for (let i = 1; i < gridWidth; i++) {
				newColor = setTileColor(sourceRowId, i);
				mapKey = getKey(sourceRowId, i);
				updateTileMap(mapKey, newColor);
				verifyClosest(newColor, sourceRowId, i);
			}
		}
	};

	const sourceClick = (rowId: number, colId: number): void => {
		updateMaxMoves(movesLeft - 1);

		switch (rgbMoveCount) {
			case 0:
				// set to red
				fillSource(rowId, colId, COLOR.RED);
				moveMade();
				break;
			case 1:
				// set to green
				fillSource(rowId, colId, COLOR.GREEN);
				moveMade();
				break;
			case 2:
				// set to blue
				fillSource(rowId, colId, COLOR.BLUE);
				moveMade();
				break;

			default:
		}
	};

	const sourceDrop = (color: number[], rowId: number, colId: number) => {
		fillSource(rowId, colId, color);
		updateMaxMoves(movesLeft - 1);
	};

	const createSourceRow = (rowId: number) => {
		const gridElements = [];
		for (let i = 1; i < gridWidth; i++) {
			gridElements.push(
				<Source
					key={"source" + rowId + "-" + i}
					rowId={rowId}
					colId={i}
					handleSourceClick={sourceClick}
					color={getSourceColor(rowId, i, sourceMap)}
					handleSourceDrop={sourceDrop}
					isClickable={sourceClickable}
				/>
			);
		}
		return <div className="source">{gridElements}</div>;
	};

	const createSourceTileRows = () => {
		const gridElements = [];
		for (let i = 1; i < gridHeight; i++) {
			gridElements.push(
				<div key={i}>
					<Source
						rowId={i}
						colId={0}
						handleSourceClick={sourceClick}
						color={getSourceColor(i, 0, sourceMap)}
						handleSourceDrop={sourceDrop}
						isClickable={sourceClickable}
					/>
					{createTileRow(i)}
					<Source
						rowId={i}
						colId={gridWidth}
						handleSourceClick={sourceClick}
						color={getSourceColor(i, gridWidth, sourceMap)}
						handleSourceDrop={sourceDrop}
						isClickable={sourceClickable}
					/>
				</div>
			);
		}
		return gridElements;
	};

	return (
		<div className="board">
			{createSourceRow(0)}
			{createSourceTileRows()}
			{createSourceRow(gridHeight)}
		</div>
	);
};

export default GameBoard;
