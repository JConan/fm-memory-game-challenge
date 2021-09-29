import { FC } from "react";
import { GameState } from "../components/Game";
import "./style.scss";

const App: FC<{ state: GameState }> = ({ state }) => {
  return (
    <div className="App">
      <span>memory</span>
      <span>select theme</span>
      <span>number of players</span>
      <span>Grid Size</span>
      <button
        className={`${state.theme === "numbers" ? "button-active" : ""}`}
        onClick={() => state.setTheme("numbers")}
      >
        numbers
      </button>
      <button
        className={`${state.theme === "icons" ? "button-active" : ""}`}
        onClick={() => state.setTheme("icons")}
      >
        icons
      </button>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>4x4</button>
      <button>6x6</button>
      <button>start game</button>
    </div>
  );
};

export default App;
