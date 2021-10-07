export type Theme = "Numbers" | "Icons";
export type GridSize = "4x4" | "6x6";
export type NumberOfPlayers = 1 | 2 | 3 | 4;
export interface Setting {
  theme: Theme;
  gridSize: GridSize;
  numberOfPlayers: NumberOfPlayers;
}
