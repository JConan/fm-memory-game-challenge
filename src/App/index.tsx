import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { GameSettings, useGameConfig } from "hooks/GameConfig";
import { GameStart } from "screens/GameStart";
import { SoloGame } from "screens/SoloGame";
import "./style.scss";

const App = () => {
  const state = useGameConfig({ useLocalStorage: true });

  return (
    <>
      {state.isLoaded && (
        <Router>
          <Switch>
            <Route path="/game/solo/:size">
              <SoloGame setting={state as GameSettings} />
            </Route>
            <Route path="/start">
              <GameStart state={state} />
            </Route>
            <Redirect path="/" to="/start" exact />
          </Switch>
        </Router>
      )}
    </>
  );
};

export default App;
