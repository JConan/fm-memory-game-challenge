export type GameTheme = "Numbers" | "Icons";

export type GameGridSize = "4x4" | "6x6";

export type GameNumberOfPlayers = "1" | "2" | "3" | "4";

export interface GameState {
  theme: GameTheme;
  gridSize: GameGridSize;
  numberOfPlayer: GameNumberOfPlayers;
  setTheme: (theme: GameTheme) => void;
  setGridSize: (gridSize: GameGridSize) => void;
  setNumberOfPlayers: (number: GameNumberOfPlayers) => void;
}
