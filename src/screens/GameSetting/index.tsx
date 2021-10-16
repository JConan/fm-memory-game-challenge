import { Link } from "react-router-dom";
import { GameSetting } from "../../hooks/useGameSetting";
import { SelectOptions } from "../../components/SelectOptions";
import "./style.scss";

export const GameSettingScreen: React.FC<{ gameSetting: GameSetting }> = ({
  gameSetting: { value: setting, ...game },
}) => {
  return (
    <div className="game-setting">
      <span className="title">memory</span>
      <div className="configuration">
        <SelectOptions
          label="Select Theme"
          values={["Numbers", "Icons"] as const}
          selected={setting.theme}
          onSelect={(value) => game.setTheme(value)}
        />
        <SelectOptions
          label="Numbers of Players"
          values={[1, 2, 3, 4] as const}
          selected={setting.numberOfPlayers}
          onSelect={(value) => game.setNumberOfPlayers(value)}
        />
        <SelectOptions
          label="Grid Size"
          values={["4x4", "6x6"] as const}
          selected={setting.gridSize}
          onSelect={(value) => game.setGridSize(value)}
        />
        <Link to={`/game`}>
          <button
            className="button-navigation"
            onClick={() => game.localStore.save()}
          >
            start game
          </button>
        </Link>
      </div>
    </div>
  );
};
