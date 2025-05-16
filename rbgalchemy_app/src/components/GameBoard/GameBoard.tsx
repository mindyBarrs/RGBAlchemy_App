import { useEffect, useState } from "react";

import Square from "../BasicShapes/Square";
import TileGrid from "./TileGrid/TileGrid";
import Source from "./Source/Source";

import { GameBoardProps } from "../../lib/types/component.types";
import { COLOR } from "../../lib/constants/colors.constants";
import { DELTA_CONST } from "../../lib/constants/utils.constants";
import { GridCoordinates } from "../../lib/types/utils.types";

import { useGameStore } from "../../zustard/store";

import "./GameBoard.css";

export const GameBoard = ({
	gridHeight,
	gridWidth,
	targetColor,
	moveCount,
	reload,
	moveMade,
	reloaded,
	win,
}: GameBoardProps) => {
	const [sourceMap, setSourceMap] = useState<Map<string, number[]>>(new Map());
	const [tileMap, setTileMap] = useState<Map<string, number[]>>(new Map());
	const [closestIndex, setClosestIndex] = useState<GridCoordinates>({
		rowId: 1,
		colId: 1,
	});

	// Reset when reload is true
	useEffect(() => {
		setSourceMap(new Map());
		setTileMap(new Map());
		setClosestIndex({ rowId: 1, colId: 1 });
		setDelta(calculateDelta(targetColor, COLOR.DEFAULT_BLACK));
		reloaded?.();
	}, [reload, targetColor]);

	const allowTileDrop = moveCount > 2;
	const sourceClickable = moveCount < 2;

	const calculateDelta = (target: number[], obtained: number[]) => {
		return (
			DELTA_CONST *
			Math.sqrt(
				(target[0] - obtained[0]) ** 2 +
					(target[1] - obtained[1]) ** 2 +
					(target[2] - obtained[2]) ** 2
			)
		);
	};

	const [delta, setDelta] = useState<number>(
		calculateDelta(targetColor, COLOR.DEFAULT_BLACK)
	);

	const convertedDelta = () => {
		return (delta * 100).toFixed(2);
	};

	/* 
  updateFunctions trigger a rerender, new Map must be created so the pointer changes
  could also use immutable.js(library) instead? 
  */
	const updateSourceMap = (k: string, v: number[]) => {
		setSourceMap(new Map(sourceMap.set(k, v)));
	};

	const updateTileMap = (k: string, v: number[]) => {
		setTileMap(new Map(tileMap.set(k, v)));
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
				setClosestIndex({ rowId: rowId, colId: colId });
				setDelta(newDelta);
			}
		}
	};

	//Set Win Condition
	useEffect(() => {
		if (delta < 0.1) {
			win?.();
		}
	}, [delta]);

	const createTileRow = (rowId: number) => {
		const gridElements = [];
		for (let i = 1; i < gridWidth; i++) {
			gridElements.push(
				<TileGrid
					key={"tile-" + rowId + "-" + i}
					rowId={rowId}
					colId={i}
					color={getTileColor(rowId, i)}
					isDraggable={allowTileDrop}
					isClosest={closestIndex.rowId === rowId && closestIndex.colId === i}
				/>
			);
		}
		return gridElements;
	};

	const getKey = (rowId: number, colId: number) => {
		return rowId.toString() + "|" + colId.toString();
	};

	// update Map of corresponding source, with  color
	const fillSource = (rowId: number, colId: number, color: number[]) => {
		let mapKey = getKey(rowId, colId);
		updateSourceMap(mapKey, color);
		updateSourceShinedTiles(rowId, colId);
	};

	const getSourceColor = (rowId: number, colId: number) => {
		let mapKey = getKey(rowId, colId);
		return sourceMap.get(mapKey) ? sourceMap.get(mapKey) : COLOR.DEFAULT_BLACK;
	};

	const getTileColor = (rowId: number, colId: number) => {
		let mapKey = getKey(rowId, colId);
		return tileMap.get(mapKey) ? tileMap.get(mapKey) : COLOR.DEFAULT_BLACK;
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
				// (source.colId == colId)
				distance = Math.abs(source.rowId - rowId);
				ratio = (gridHeight - distance + 1) / (gridHeight + 1);
			}
			let sourceColor = getSourceColor(source.rowId, source.colId);
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
		switch (moveCount) {
			case 0:
				// set to red
				fillSource(rowId, colId, COLOR.RED);
				moveMade?.();
				break;
			case 1:
				// set to green
				fillSource(rowId, colId, COLOR.GREEN);
				moveMade?.();
				break;
			case 2:
				// set to blue
				fillSource(rowId, colId, COLOR.BLUE);
				moveMade?.();
				break;

			default:
			// code block
			// props.handleMoveMade();
		}
	};

	const sourceDrop = (color: number[], rowId: number, colId: number) => {
		fillSource(rowId, colId, color);
		moveMade?.();
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
					color={getSourceColor(rowId, i)}
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
				<div>
					<Source
						rowId={i}
						colId={0}
						handleSourceClick={sourceClick}
						color={getSourceColor(i, 0)}
						handleSourceDrop={sourceDrop}
						isClickable={sourceClickable}
					/>
					{createTileRow(i)}
					<Source
						rowId={i}
						colId={gridWidth}
						handleSourceClick={sourceClick}
						color={getSourceColor(i, gridWidth)}
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
