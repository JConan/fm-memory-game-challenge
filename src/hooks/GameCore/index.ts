import { GameGridSize, GameSettings } from "hooks/GameConfig";
import { generateTileValues } from "libraries/Tools";
import { useEffect, useState } from "react";

type TyleState = "hidden" | "selected" | "paired";

interface TileState {
  id: number;
  value: number;
  state: TyleState;
}

export const useGameCore = ({ gridSize }: GameSettings) => {
  const [isLoaded, setLoaded] = useState(false);
  const [tiles, setTiles] = useState<TileState[]>(undefined!);

  useInitTiles(gridSize, setTiles, setLoaded);

  useEffect(() => {
    if (isLoaded) {
      const selectedTiles = findTilesBy(tiles, { state: "selected" });
      if (selectedTiles.length === 2)
        if (selectedTiles[0].value === selectedTiles[1].value) {
          const updatedTiles = updateTiles(tiles, selectedTiles, "paired");
          setTiles(updatedTiles);
        } else {
          const updatedTiles = updateTiles(tiles, selectedTiles, "hidden");
          setTiles(updatedTiles);
        }
    }
  }, [isLoaded, tiles]);

  const onSelectTile = ({ id }: { id: number }) => {
    const selectedTile = findTilesBy(tiles, { id })[0];
    if (selectedTile.state === "hidden") {
      const updatedTiles = updateTiles(tiles, [selectedTile], "selected");
      updatedTiles.sort((a, b) => a.id - b.id);
      setTiles(updatedTiles);
    }
  };

  return { isLoaded, tiles, onSelectTile };
};

const useInitTiles = (
  gridSize: GameGridSize,
  setTiles: (value: React.SetStateAction<TileState[]>) => void,
  setLoaded: (value: React.SetStateAction<boolean>) => void
) => {
  useEffect(() => {
    const tileValues = generateTileValues({ gridSize }).map(
      (value, id) => ({ id, value, state: "hidden" } as TileState)
    );

    setTiles(tileValues);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const updateTiles = (
  tiles: TileState[],
  selectedTiles: TileState[],
  newState: TyleState
) => {
  const ids = selectedTiles.map((t) => t.id);
  return tiles.map((tile) => {
    if (ids.includes(tile.id)) {
      return {
        ...tile,
        state: newState,
      } as TileState;
    }
    return tile;
  });
};

const findTilesBy = (
  tiles: TileState[],
  filter: { id?: number; state?: TyleState }
) =>
  Object.keys(filter)
    .map((key) =>
      tiles.filter(
        (tile) =>
          (tile as Record<string, any>)[key] ===
          (filter as Record<string, any>)[key]
      )
    )
    .flatMap((x) => x);
