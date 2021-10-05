import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { GameSettings, useGameConfig } from "hooks/GameConfig";
import { NewGame } from "screens/NewGame";
import { SoloGame } from "screens/SoloGame";
import "./style.scss";

const App = () => {
  const state = useGameConfig({ useLocalStorage: true });

  return (
    <>
      {state.isLoaded && (
        <Router>
          <Switch>
            <Route path="/solo">
              <SoloGame setting={state as GameSettings} />
            </Route>
            <Route path="/new">
              <NewGame state={state} />
            </Route>
            <Redirect path="/" to="/new" exact />
          </Switch>
        </Router>
      )}
    </>
  );
};

export default App;
