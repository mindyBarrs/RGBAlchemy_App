import axios from "axios";

import { GameResponse } from "../lib/types/game.types";

import {
	INITIALIZE_GAME_URL,
	NEW_GAME_URL,
} from "../lib/constants/url.constants";

/**
 * Initializes the game by fetching the initial game data from the server.
 * @returns {Promise<GameData>} The initial game data.
 * @throws {Error} If the request fails or the response is not valid.
 */
export const initializeGame = async (): Promise<GameResponse> => {
	const response = await axios.get(INITIALIZE_GAME_URL);

	if (response.status < 200 || response.status >= 300) {
		throw new Error("Failed to initialize game");
	}

	const data = await response.data;

	return data;
};

/**
 * Creates a new game for the specified user by fetching the game data from the server.
 * @param {string} userId - The ID of the user for whom to create a new game.
 * @returns {Promise<GameData>} The new game data.
 * @throws {Error} If the request fails or the response is not valid.
 */
export const newGame = async (userId: string): Promise<GameResponse> => {
	const response = await axios.get(NEW_GAME_URL, { params: { userId } });

	if (response.status < 200 || response.status >= 300) {
		throw new Error("Failed to create new game");
	}

	const data = await response.data;

	return data;
};
