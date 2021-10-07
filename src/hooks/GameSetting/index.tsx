import { useState } from "react";
import store from "store2";
import { Setting, Theme, GridSize, NumberOfPlayers } from "./types";

export interface GameSetting {
  value: Setting;
  setTheme: (theme: Theme) => void;
  setGridSize: (gridSize: GridSize) => void;
  setNumberOfPlayers: (numberOfPlayers: NumberOfPlayers) => void;
  localStore: {
    load: () => void;
    save: () => void;
  };
}

const defaultSetting: Setting = {
  gridSize: "4x4",
  numberOfPlayers: 1,
  theme: "Numbers",
};

export const useGameSetting = (): GameSetting => {
  const [setting, setSetting] = useState(defaultSetting);

  return {
    value: setting,
    setTheme: (theme) => setSetting({ ...setting, theme }),
    setGridSize: (gridSize) => setSetting({ ...setting, gridSize }),
    setNumberOfPlayers: (numberOfPlayers) =>
      setSetting({ ...setting, numberOfPlayers }),
    localStore: {
      load: () => {
        const data = store.get("GameSetting");
        data && setSetting(data);
      },
      save: () => store.set("GameSetting", setting, true),
    },
  };
};

export * from "./types";
