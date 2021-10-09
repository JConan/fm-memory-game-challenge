import { GridSize } from "../useGameSetting";
import { useEffect, useState } from "react";
import { useDelayedSignal } from "../useDelayedSignal";
import { TilesetHandler } from "./types";
import { Tile } from "../useGameCore";
import { generateTiles, matchBy, updateWhenMatch } from "./utils";
import { TILES_RESOLUTION_DELAY } from "./const";

export const useTilesetHandler = ({
  gridSize,
}: {
  gridSize: GridSize;
}): TilesetHandler => {
  const [tiles, setTiles] = useState<Tile[]>();
  const [resetCounter, setResetCounter] = useState(0);
  const { state: signal, pulse } = useDelayedSignal({
    delay: TILES_RESOLUTION_DELAY,
  });

  // initialize tiles with gridSize
  useEffect(() => {
    setTiles(generateTiles(gridSize));
  }, [gridSize, resetCounter]);

  useEffect(() => {
    if (tiles && !signal) {
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
      }
      const updatedTiles = tiles.map(resolver);
      setTiles(updatedTiles);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);

  return {
    tiles,
    select: ({ id }) => {
      const selectedTiles = tiles.filter(matchBy({ state: "selected" }));
      const selectedTile = tiles.filter(matchBy({ id }))[0];
      if (selectedTiles.length < 2 && selectedTile.state === "hidden") {
        const updatedTiles = tiles.map(
          updateWhenMatch({ state: "selected" }, { id })
        );
        setTiles(updatedTiles);

        // trigger delay for tiles selection resolution
        selectedTiles.length === 1 && pulse();
      }
    },
    reset: () => {
      setResetCounter(resetCounter + 1);
    },
  };
};
