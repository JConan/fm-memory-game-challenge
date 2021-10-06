import store from "store2";

export interface GameConfig {
  getSetting: () => GameSetting;
  setTheme: (theme: Theme) => Promise<GameSetting>;
  setGridSize: (gridSize: GridSize) => Promise<GameSetting>;
  setNumberOfPlayers: (number: NumberOfPlayers) => Promise<GameSetting>;
  localStore: {
    load: () => Promise<GameSetting>;
    save: () => Promise<GameSetting>;
  };
}

export class GameConfig {
  private settings: GameSetting = {
    theme: "Numbers",
    gridSize: "4x4",
    numberOfPlayers: 1,
  };

  constructor() {
    /* Get cloned Settings data */
    this.getSetting = () => ({ ...this.settings });

    /* internal data mutators */
    this.setTheme = async (theme) => {
      this.settings.theme = theme;
      return this.getSetting();
    };
    this.setGridSize = async (gridSize) => {
      this.settings.gridSize = gridSize;
      return this.getSetting();
    };
    this.setNumberOfPlayers = async (number) => {
      this.settings.numberOfPlayers = number;
      return this.getSetting();
    };

    /* sync with local storage */
    this.localStore = {
      load: async () => {
        const data = store.get("GameConfig");
        if (data) {
          this.settings = data;
        }
        return this.getSetting();
      },
      save: async () => {
        store.set("GameConfig", this.settings, true);
        return this.getSetting();
      },
    };
  }
}

export type Theme = "Numbers" | "Icons";
export type GridSize = "4x4" | "6x6";
export type NumberOfPlayers = 1 | 2 | 3 | 4;
export interface GameSetting {
  theme: Theme;
  gridSize: GridSize;
  numberOfPlayers: NumberOfPlayers;
}
