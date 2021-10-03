import { useState } from "react";
import {
  GameConfig,
  GameTheme,
  GameGridSize,
  GameNumberOfPlayers,
} from "./types";

export const useGameConfig = (): GameConfig => {
  const [theme, setTheme] = useState<GameTheme>("Numbers");
  const [gridSize, setGridSize] = useState<GameGridSize>("4x4");
  const [numberOfPlayer, setNumberOfPlayers] =
    useState<GameNumberOfPlayers>("1");

  return {
    theme,
    gridSize,
    numberOfPlayer,
    tilesResolutionDelay: 1000,
    setTheme,
    setGridSize,
    setNumberOfPlayers,
  };
};

export * from "./types";
