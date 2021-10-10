import { Chance } from "chance";
import { useEffect, useState } from "react";
import { loadIcons } from "../TileIcons";
import { Setting } from "../../hooks/useGameSetting";

import "./style.scss";

export type TyleState = "hidden" | "selected" | "paired";

export interface TileState {
  id: number;
  value: number;
  state: TyleState;
}

interface TileGridProps {
  tiles: TileState[];
  setting: Setting;
  onSelectTile: (tileId: number) => void;
}

export const TileGrid = ({ tiles, setting, onSelectTile }: TileGridProps) => {
  const [iconSet, setIconSet] = useState<JSX.Element[]>(null!);

  useEffect(() => {
    setIconSet(Chance().shuffle(loadIcons()));
  }, []);

  return (
    <ul
      aria-label="memory item list"
      className={`tiles-grid tiles-grid-${setting.gridSize}`}
    >
      {tiles.map((tile, idx) => (
        <li
          key={idx}
          aria-label="memory item"
          onClick={() => onSelectTile(tile.id)}
          className={`tile tile-${tile.state}`}
        >
          {tile.state !== "hidden" &&
            (setting.theme === "Numbers" ? tile.value : iconSet[tile.value])}
        </li>
      ))}
    </ul>
  );
};
