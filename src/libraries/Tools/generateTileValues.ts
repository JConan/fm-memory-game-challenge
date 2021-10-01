import { Chance } from "chance";
import { GameGridSize } from "hooks/GameConfig";

export interface GenerateTileValuesProps {
  gridSize: GameGridSize;
}

export type GenerateTileValues = (props: GenerateTileValuesProps) => number[];

export const generateTileValues: GenerateTileValues = ({ gridSize }) =>
  Chance().shuffle(
    Array(gridSize === "4x4" ? 8 : 18)
      .fill(0)
      .map((_, i) => [i, i])
      .flatMap((x) => x)
  );
