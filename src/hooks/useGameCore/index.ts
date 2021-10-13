import { Setting } from "../../hooks/useGameSetting";
import { useTilesetHandler, matchBy } from "../../hooks/useTilesetHandler";
import { useEffect, useState } from "react";

export const useGameCore = ({ gridSize }: Pick<Setting, "gridSize">) => {
  const { tiles, select, reset, remainPair } = useTilesetHandler({ gridSize });

  const [isGameOver, setGameOver] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded && tiles.length > 0) setLoaded(true);
    if (isLoaded) {
      if (tiles.filter(matchBy({ state: "paired" })).length === tiles.length) {
        setGameOver(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  return {
    isGameOver,
    tiles,
    isLoaded,
    remainPair,
    onSelectTile: (tile: { id: number }) => select(tile),
    restartGame: () => {
      reset();
      setGameOver(false);
    },
  };
};

export * from "../../hooks/useTilesetHandler/types";
