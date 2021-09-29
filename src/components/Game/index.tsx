import { useState } from "react";
import { GameState, GameTheme, GameGridSize } from "./types";

export const useGameState = (): GameState => {
  const [theme, setTheme] = useState<GameTheme>("Numbers");
  const [gridSize, setGridSize] = useState<GameGridSize>("4x4");

  return {
    theme,
    gridSize,
    setTheme,
    setGridSize,
  };
};

export * from "./types";
