import { useEffect, useState } from "react";
import {
  GameTheme,
  GameGridSize,
  GameNumberOfPlayers,
  UseGameConfig,
  GameSettings,
} from "./types";
import store from "store2";

export const useGameConfig: UseGameConfig = ({
  useLocalStorage = false,
} = {}) => {
  const [isLoaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<GameTheme>("Numbers");
  const [gridSize, setGridSize] = useState<GameGridSize>("4x4");
  const [numberOfPlayer, setNumberOfPlayers] =
    useState<GameNumberOfPlayers>("1");

  useEffect(() => {
    let config: Partial<GameSettings> = {
      gridSize: "4x4",
      numberOfPlayer: "1",
      theme: "Numbers",
    };
    if (useLocalStorage) {
      const data = store.get("game-settings") as GameSettings;
      config = { ...config, ...data };
    }
    setTheme(config.theme!);
    setGridSize(config.gridSize!);
    setNumberOfPlayers(config.numberOfPlayer!);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localStorage && isLoaded) {
      store.set(
        "game-settings",
        {
          theme,
          gridSize,
          numberOfPlayer,
        },
        true
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, gridSize, numberOfPlayer]);

  return {
    isLoaded,
    theme,
    gridSize,
    numberOfPlayer,
    tilesResolutionDelay: 650,
    setTheme,
    setGridSize,
    setNumberOfPlayers,
  };
};

export * from "./types";
