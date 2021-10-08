import { useGameSetting } from "../hooks/useGameSetting";
import { useEffect, useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router";
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

  const history = useHistory();

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
              <div>To Be implemented</div>
              <button
                onClick={() => {
                  history.goBack();
                }}
              >
                back
              </button>
            </Route>
            <Redirect to="/setting" />
          </Switch>
        </div>
      )}
    </>
  );
};
