import { GameSetting } from "data";
import { GameSettingScreen } from "screens/GameSetting";
import "./style.scss";

export const GameApp = () => {
  const gameSetting = new GameSetting();

  return (
    <div className="game-app">
      <GameSettingScreen {...{ gameSetting }} />
    </div>
  );
};
