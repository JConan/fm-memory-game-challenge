import { useState } from "react";
import {
  GameState,
  GameTheme,
  GameGridSize,
  GameNumberOfPlayers,
} from "./types";

export const useGameState = (): GameState => {
  const [theme, setTheme] = useState<GameTheme>("Numbers");
  const [gridSize, setGridSize] = useState<GameGridSize>("4x4");
  const [numberOfPlayer, setNumberOfPlayers] =
    useState<GameNumberOfPlayers>("1");

  return {
    theme,
    gridSize,
    numberOfPlayer,
    setTheme,
    setGridSize,
    setNumberOfPlayers,
  };
};

export * from "./types";
