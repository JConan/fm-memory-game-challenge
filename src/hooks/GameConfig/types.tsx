export type GameTheme = "Numbers" | "Icons";

export type GameGridSize = "4x4" | "6x6";

export type GameNumberOfPlayers = "1" | "2" | "3" | "4";

export interface GameSettings {
  theme: GameTheme;
  gridSize: GameGridSize;
  numberOfPlayer: GameNumberOfPlayers;
  tilesResolutionDelay: number;
}

export type GameConfig = GameSettings & {
  setTheme: (theme: GameTheme) => void;
  setGridSize: (gridSize: GameGridSize) => void;
  setNumberOfPlayers: (number: GameNumberOfPlayers) => void;
};
