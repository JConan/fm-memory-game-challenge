import { GridSize, Setting } from "../../hooks/useGameSetting";
import { useDelayedSignal } from "../../hooks/useDelayedSignal";
import { generateTileValues } from "../../libraries/Tools";
import { useEffect, useState } from "react";

export type TyleState = "hidden" | "selected" | "paired";

export interface TileState {
  id: number;
  value: number;
  state: TyleState;
}

export const useGameCore = ({ gridSize }: Pick<Setting, "gridSize">) => {
  const { state: isDelaying, pulse } = useDelayedSignal({ delay: 650 });
  const [isLoaded, setLoaded] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [tiles, setTiles] = useState<TileState[]>(undefined!);
  const [selectedTiles, setSelectedTiles] = useState<TileState[]>([]);

  // initialize tiles
  const { reset: resetTiles } = useInitTiles(gridSize, setTiles, setLoaded);

  // resolve tiles states after pulse ended
  useEffect(() => {
    if (isLoaded && !isDelaying) {
      if (selectedTiles.length >= 2) {
        // cleanup selections
        const _selectedTiles = [...selectedTiles];
        if (_selectedTiles.length % 2 !== 0) {
          setSelectedTiles([_selectedTiles.pop()!]);
        } else {
          setSelectedTiles([]);
        }

        // resolve tiles states
        const toUpdate = _selectedTiles.map(
          (tile) =>
            (findTilesBy(_selectedTiles, { value: tile.value }).length === 2
              ? { ...tile, state: "paired" }
              : { ...tile, state: "hidden" }) as TileState
        );
        const updatedTiles = tiles.map((tile) => {
          const result = toUpdate.find(({ id }) => tile.id === id);
          return result ? result : tile;
        });
        setTiles(updatedTiles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDelaying]);

  useEffect(() => {
    if (tiles) {
      // check remaining hidden tiles
      const pairedTiles = tiles.filter(({ state }) => state === "paired");
      if (pairedTiles.length === (gridSize === "4x4" ? 16 : 36)) {
        setGameOver(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  // update tile & give a pulse
  const onSelectTile = ({ id }: { id: number }): boolean => {
    if (findTilesBy(selectedTiles, { id }).length !== 0) return false;

    if (isLoaded && selectedTiles.length < 2) {
      const selectedTile = findTilesBy(tiles, { id })[0];
      setSelectedTiles([...selectedTiles, selectedTile]);
      if (selectedTile.state === "hidden") {
        const updatedTiles = updateTiles(tiles, [selectedTile], "selected");
        updatedTiles.sort((a, b) => a.id - b.id);
        setTiles(updatedTiles);
        pulse();
        return true;
      }
    }
    return false;
  };

  return {
    isGameOver,
    isLoaded,
    tiles,
    onSelectTile,
    restartGame: () => {
      setSelectedTiles([]);
      resetTiles();
      setGameOver(false);
    },
  };
};

const useInitTiles = (
  gridSize: GridSize,
  setTiles: (value: React.SetStateAction<TileState[]>) => void,
  setLoaded: (value: React.SetStateAction<boolean>) => void
) => {
  const [isGenerated, setGenerated] = useState(false);

  useEffect(() => {
    if (!isGenerated) {
      const tileValues = generateTileValues({ gridSize }).map(
        (value, id) => ({ id, value, state: "hidden" } as TileState)
      );

      setTiles(tileValues);
      setLoaded(true);
      setGenerated(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerated]);

  const reset = () => {
    setGenerated(false);
  };
  return { reset };
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

const findTilesBy = (tiles: TileState[], filter: Partial<TileState>) =>
  Object.keys(filter)
    .map((key) =>
      tiles.filter(
        (tile) =>
          (tile as Record<string, any>)[key] ===
          (filter as Record<string, any>)[key]
      )
    )
    .flatMap((x) => x);
