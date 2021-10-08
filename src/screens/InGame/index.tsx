import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { GameSetting } from "../../hooks/useGameSetting";
import { useGameCore } from "../../hooks/useGameCore";
import { ModalMenu } from "../../components/ModalMenu";
import { TileGrid } from "../../components/TileGrid";
import "./style.scss";

export const InGame: React.FC<{ setting: GameSetting }> = ({
  setting: { value: setting },
}) => {
  const [isMenuShowned, setShowMenu] = useState(false);
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
          {isLoaded && (
            <TileGrid {...{ tiles, setting, onSelectTile: selectTile }} />
          )}
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
