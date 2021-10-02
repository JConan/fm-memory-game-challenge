import { useTimer } from "hooks/Timer";
import { generateTileValues } from "libraries/Tools";
import { loadIcons } from "components/TileIcons";
import { Chance } from "chance";
import "./style.scss";
import { useEffect, useState } from "react";
import { GameConfig } from "hooks/GameConfig";

export const SoloGame: React.FC<{ state: GameConfig }> = ({
  state: { theme },
}) => {
  const [tileValues, setTileValues] = useState<number[]>(null!);
  const [iconSet, setIconSet] = useState<JSX.Element[]>(null!);
  const { value: timerValue } = useTimer();

  useEffect(() => {
    setTileValues(generateTileValues({ gridSize: "4x4" }));
    setIconSet(Chance().shuffle(loadIcons()));
  }, []);

  return (
    <div className="screen-container">
      <header>
        <span>memory</span>
        <button>menu</button>
      </header>
      <main>
        <ul aria-label="memory item list">
          {tileValues &&
            tileValues.map((tileValue, idx) => (
              <li key={idx} aria-label="memory item">
                {theme === "Numbers" ? tileValue : iconSet[tileValue]}
              </li>
            ))}
        </ul>
      </main>
      <footer>
        <div role="timer" aria-label="time">
          <span>Time</span>
          <span>{timerValue}</span>
        </div>
        <div role="status" aria-label="moves">
          <span>Moves</span>
          <span>36</span>
        </div>
      </footer>
    </div>
  );
};
