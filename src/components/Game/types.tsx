export type GameTheme = "numbers" | "icons";

export interface GameState {
  theme: GameTheme;
  setTheme: (theme: GameTheme) => void;
}
