import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useGameConfig } from "hooks/GameConfig";
import { GameStart } from "screens/GameStart";
import { SoloGame } from "screens/SoloGame";
import "./style.scss";

const App = () => {
  const state = useGameConfig();

  return (
    <Router>
      <Switch>
        <Route path="/game/solo/:size">
          <SoloGame state={state} />
        </Route>
        <Route path="/start">
          <GameStart state={state} />
        </Route>
        <Redirect path="/" to="/start" exact />
      </Switch>
    </Router>
  );
};

export default App;
