import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useGameState } from "../hooks/GameState";
import { Start } from "../screens/Start";
import { SoloGame } from "../screens/SoloGame";
import "./style.scss";

const App = () => {
  const state = useGameState();

  return (
    <Router>
      <Switch>
        <Route path="/game/solo/:size" component={SoloGame} />
        <Route path="/start">
          <Start state={state} />
        </Route>
        <Redirect path="/" to="/start" exact />
      </Switch>
    </Router>
  );
};

export default App;
