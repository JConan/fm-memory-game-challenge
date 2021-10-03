import { useTimer } from "hooks/Timer";
import { loadIcons } from "components/TileIcons";
import { Chance } from "chance";
import { useEffect, useState } from "react";
import { GameSettings } from "hooks/GameConfig";
import { useGameCore } from "hooks/GameCore";
import "./style.scss";

export const SoloGame: React.FC<{ setting: GameSettings }> = ({ setting }) => {
  const { isLoaded, tiles, onSelectTile } = useGameCore(setting);

  const [iconSet, setIconSet] = useState<JSX.Element[]>(null!);
  const { value: timerValue } = useTimer();

  useEffect(() => {
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
          {isLoaded &&
            tiles.map((tile, idx) => (
              <li
                key={idx}
                aria-label="memory item"
                onClick={() => onSelectTile({ id: tile.id })}
                className={`tile-${tile.state} tile-size-${setting.gridSize}`}
              >
                {tile.state !== "hidden" &&
                  (setting.theme === "Numbers"
                    ? tile.value
                    : iconSet[tile.value])}
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
