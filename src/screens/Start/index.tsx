import { FC } from "react";
import { GameState } from "../../components/Game";
import { SelectOptions } from "../../components/SelectOptions";
import "./style.scss";

export const Start: FC<{ state: GameState }> = ({ state }) => {
  return (
    <div className="screen-start-container">
      <span className="title">memory</span>
      <div className="configuration">
        <SelectOptions
          label="Select Theme"
          values={["Numbers", "Icons"] as const}
          selected={state.theme}
          onSelect={(value) => state.setTheme(value)}
        />
        <SelectOptions
          label="Numbers of Players"
          values={["1", "2", "3", "4"] as const}
          selected={state.numberOfPlayer}
          onSelect={(value) => state.setNumberOfPlayers(value)}
        />
        <SelectOptions
          label="Grid Size"
          values={["4x4", "6x6"] as const}
          selected={state.gridSize}
          onSelect={(value) => state.setGridSize(value)}
        />
        <button className="button-navigation">start game</button>
      </div>
    </div>
  );
};
