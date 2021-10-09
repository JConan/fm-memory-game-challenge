export type TileState = "hidden" | "selected" | "paired";

export interface Tile {
  id: number;
  value: number;
  state: TileState;
}
export interface TilesetHandler {
  tiles: Tile[];
  select: (props: { id: number }) => boolean;
  reset: () => void;
}
