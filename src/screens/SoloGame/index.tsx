import { useTimer } from "hooks/Timer";
import { loadIcons } from "components/TileIcons";
import { Chance } from "chance";
import { useEffect, useState } from "react";
import { GameSettings } from "hooks/GameConfig";
import { useGameCore } from "hooks/GameCore";
import { ModalMenu } from "components/ModalMenu";
import { useHistory } from "react-router";
import "./style.scss";

export const SoloGame: React.FC<{ setting: GameSettings }> = ({ setting }) => {
  const [isMenuShowned, setShowMenu] = useState(false);
  const [iconSet, setIconSet] = useState<JSX.Element[]>(null!);
  const [moveCount, setMoveCount] = useState(0);

  const {
    isLoaded,
    tiles,
    onSelectTile,
    restartGame: resetTiles,
  } = useGameCore(setting);
  const timer = useTimer();
  const history = useHistory();

  useEffect(() => {
    setIconSet(Chance().shuffle(loadIcons()));
    timer.start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // *-------------*
  // * actions
  const selectTile = (id: number) => {
    onSelectTile({ id }) && setMoveCount(moveCount + 1);
  };

  const showMenu = () => {
    setShowMenu(true);
    timer.stop();
  };

  const hideMenu = () => {
    setShowMenu(false);
    timer.start();
  };

  const resetGame = () => {
    setMoveCount(0);
    timer.restart();
    resetTiles();
    hideMenu();
  };

  return (
    <>
      <div className="screen-container">
        <header>
          <span>memory</span>
          <button onClick={showMenu}>menu</button>
        </header>
        <main>
          <ul aria-label="memory item list">
            {isLoaded &&
              tiles.map((tile, idx) => (
                <li
                  key={idx}
                  aria-label="memory item"
                  onClick={() => selectTile(tile.id)}
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
            <span>{timer.value}</span>
          </div>
          <div role="status" aria-label="moves">
            <span>Moves</span>
            <span>{moveCount}</span>
          </div>
        </footer>
      </div>
      {isMenuShowned && (
        <ModalMenu
          onClose={hideMenu}
          onResume={hideMenu}
          onNewGame={() => history.push("/")}
          onRestart={resetGame}
        />
      )}
    </>
  );
};
