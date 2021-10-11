import { useGameSetting } from "../hooks/useGameSetting";
import { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router";
import { GameSettingScreen } from "../screens/GameSetting";
import { InGame } from "../screens/InGame";
import "./style.scss";

export const App = () => {
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
              <InGame setting={gameSetting} />
            </Route>
            <Route path="/multi">
              <InGame setting={gameSetting} />
            </Route>
            <Redirect to="/setting" />
          </Switch>
        </div>
      )}
    </>
  );
};
