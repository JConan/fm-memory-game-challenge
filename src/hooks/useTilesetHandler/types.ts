import { Tile } from "../useGameCore";

export interface TilesetHandler {
  tiles: Tile[];
  select: (props: { id: number }) => void;
  reset: () => void;
}
