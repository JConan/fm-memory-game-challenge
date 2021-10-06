import { Link } from "react-router-dom";
import { GameSetting } from "data";
import { SelectOptions } from "components/SelectOptions";
import "./style.scss";
import { useEffect, useState } from "react";

export const GameSettingScreen: React.FC<{ gameSetting: GameSetting }> = ({
  gameSetting,
}) => {
  const [setting, setSetting] = useState(gameSetting.getSetting());

  useEffect(() => {
    // console.log({ setting });
  }, [setting]);

  return (
    <div className="game-setting">
      <span className="title">memory</span>
      <div className="configuration">
        <SelectOptions
          label="Select Theme"
          values={["Numbers", "Icons"] as const}
          selected={setting.theme}
          onSelect={(value) => gameSetting.setTheme(value).then(setSetting)}
        />
        <SelectOptions
          label="Numbers of Players"
          values={[1, 2, 3, 4] as const}
          selected={setting.numberOfPlayers}
          onSelect={(value) => {
            gameSetting.setNumberOfPlayers(value).then(setSetting);
          }}
        />
        <SelectOptions
          label="Grid Size"
          values={["4x4", "6x6"] as const}
          selected={setting.gridSize}
          onSelect={(value) => gameSetting.setGridSize(value).then(setSetting)}
        />
        <Link to={`/${setting.numberOfPlayers === 1 ? "solo" : "multi"}`}>
          <button className="button-navigation">start game</button>
        </Link>
      </div>
    </div>
  );
};
