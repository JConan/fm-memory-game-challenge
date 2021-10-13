import { GridSize } from "../useGameSetting";
import { useCallback, useEffect, useState } from "react";
import { useDelayedSignal } from "../useDelayedSignal";
import { Tile, TilesetHandler } from "./types";
import { generateTiles, matchBy, updateWhenMatch } from "./utils";
import { TILES_RESOLUTION_DELAY } from "./const";

export const useTilesetHandler = ({
  gridSize,
}: {
  gridSize: GridSize;
}): TilesetHandler => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [resetCounter, setResetCounter] = useState(0);
  const [remainPair, setRemainPair] = useState(gridSize === "4x4" ? 8 : 18);
  const { state: signal, pulse } = useDelayedSignal({
    delay: TILES_RESOLUTION_DELAY,
  });

  // initialize tiles with gridSize
  useEffect(() => {
    setTiles(generateTiles(gridSize));
  }, [gridSize, resetCounter]);

  // tiles resolution
  useEffect(() => {
    if (tiles.length > 0 && !signal) {
      const [a, b] = tiles.filter(matchBy({ state: "selected" }));

      let resolver = updateWhenMatch(
        { state: "hidden" },
        { state: "selected" }
      );
      if (a.value === b.value) {
        resolver = updateWhenMatch(
          { state: "paired" },
          { id: a.id },
          { id: b.id }
        );
        setRemainPair(remainPair - 1);
      }
      const updatedTiles = tiles.map(resolver);
      setTiles(updatedTiles);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);

  return {
    tiles,
    remainPair,
    select: useCallback(
      ({ id }) => {
        const selectedTiles = tiles.filter(matchBy({ state: "selected" }));
        const selectedTile = tiles.filter(matchBy({ id }))[0];
        if (selectedTiles.length < 2 && selectedTile.state === "hidden") {
          const updatedTiles = tiles.map(
            updateWhenMatch({ state: "selected" }, { id })
          );
          setTiles(updatedTiles);

          // trigger delay for tiles selection resolution
          selectedTiles.length === 1 && pulse();
          return true;
        }
        return false;
      },
      [pulse, tiles]
    ),
    reset: () => {
      setResetCounter(resetCounter + 1);
    },
  };
};

export * from "./types";
export * from "./const";
export * from "./utils";
