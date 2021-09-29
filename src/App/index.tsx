import { FC } from "react";
import { GameState } from "../components/Game";
import { SelectOptions } from "../components/SelectOptions";
import "./style.scss";

const App: FC<{ state: GameState }> = ({ state }) => {
  return (
    <div className="App">
      <span>memory</span>
      <SelectOptions
        label="Select Theme"
        values={["Numbers", "Icons"] as const}
        selected={state.theme}
        onSelect={(value) => state.setTheme(value)}
      />

      <span>number of players</span>
      <span>Grid Size</span>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button
        className={`${state.gridSize === "4x4" ? "button-active" : ""}`}
        onClick={() => state.setGridSize("4x4")}
      >
        4x4
      </button>
      <button
        className={`${state.gridSize === "6x6" ? "button-active" : ""}`}
        onClick={() => state.setGridSize("6x6")}
      >
        6x6
      </button>
      <button>start game</button>
    </div>
  );
};

export default App;
