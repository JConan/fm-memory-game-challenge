import { generateTileValues } from "../../libraries/Tools";
import { Tile } from "../useGameCore";
import { GridSize } from "../useGameSetting";

export const generateTiles = (gridSize: GridSize) =>
  generateTileValues({ gridSize }).map(
    (value, id) =>
      ({
        id,
        value,
        state: "hidden",
      } as Tile)
  );

export const updateWhenMatch =
  (update: Partial<Tile>, ...filters: Partial<Tile>[]) =>
  (tile: Tile): Tile => {
    for (const filter of filters) {
      if (matchBy(filter)(tile)) return { ...tile, ...update };
    }
    return tile;
  };

export const matchBy =
  <T extends {}, P extends Partial<T>, K extends keyof P>(b: P) =>
  (a: T): boolean =>
    !Object.keys(b)
      .map((k) => (a as unknown as P)[k as K] === b[k as K])
      .includes(false);
