import { useState } from "react";
import { GameState, GameTheme } from "./types";

export const useGameState = (): GameState => {
  const [theme, setTheme] = useState<GameTheme>("numbers");

  return {
    theme,
    setTheme,
  };
};

export * from "./types";
