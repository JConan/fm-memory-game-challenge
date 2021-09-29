export type GameTheme = "Numbers" | "Icons";

export type GameGridSize = "4x4" | "6x6";

export interface GameState {
  theme: GameTheme;
  gridSize: GameGridSize;
  setTheme: (theme: GameTheme) => void;
  setGridSize: (gridSize: GameGridSize) => void;
}
