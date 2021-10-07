import { useGameSetting, GameSetting } from "hooks/GameSetting";
import { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router";
import { GameSettingScreen } from "screens/GameSetting";
import "./style.scss";

const TestScreen: React.FC<{ gameSetting: GameSetting }> = ({
  gameSetting,
}) => {
  useEffect(() => {
    console.log(gameSetting.value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};

export const GameApp = () => {
  const [isLoaded, setLoaded] = useState(false);
  const gameSetting = useGameSetting();

  useEffect(() => {
    gameSetting.localStore.load();
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoaded && <div role="progressbar">loading ...</div>}
      {isLoaded && (
        <div className="game-app">
          <Switch>
            <Route path="/setting">
              <GameSettingScreen gameSetting={gameSetting} />
            </Route>
            <Route path="/solo">
              <TestScreen gameSetting={gameSetting} />
            </Route>
            <Route path="/multi">
              <TestScreen gameSetting={gameSetting} />
            </Route>
            <Redirect to="/setting" />
          </Switch>
        </div>
      )}
    </>
  );
};
