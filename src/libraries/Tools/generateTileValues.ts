import { Chance } from "chance";
import { GenerateTileValues } from "./types";

export const generateTileValues: GenerateTileValues = ({ gridSize }) =>
  Chance().shuffle(
    Array(gridSize === "4x4" ? 8 : 18)
      .fill(0)
      .map((_, i) => [i, i])
      .flatMap((x) => x)
  );
