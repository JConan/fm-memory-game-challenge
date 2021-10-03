import { GameGridSize, GameSettings } from "hooks/GameConfig";
import { useDelayFlipFlop } from "hooks/DelayFlipFlop";
import { generateTileValues } from "libraries/Tools";
import { useEffect, useState } from "react";

export type TyleState = "hidden" | "selected" | "paired";

export interface TileState {
  id: number;
  value: number;
  state: TyleState;
}

export const useGameCore = ({
  gridSize,
  tilesResolutionDelay: delay,
}: GameSettings) => {
  const { state: isDelaying, pulse } = useDelayFlipFlop({ delay });
  const [isLoaded, setLoaded] = useState(false);
  const [tiles, setTiles] = useState<TileState[]>(undefined!);
  const [selectedTiles, setSelectedTiles] = useState<TileState[]>([]);

  // initialize tiles
  useInitTiles(gridSize, setTiles, setLoaded);

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

  // update tile & give a pulse
  const onSelectTile = ({ id }: { id: number }) => {
    if (isLoaded) {
      const selectedTile = findTilesBy(tiles, { id })[0];
      setSelectedTiles([...selectedTiles, selectedTile]);
      if (selectedTile.state === "hidden") {
        const updatedTiles = updateTiles(tiles, [selectedTile], "selected");
        updatedTiles.sort((a, b) => a.id - b.id);
        setTiles(updatedTiles);
        pulse();
      }
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
