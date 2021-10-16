import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { GameSetting } from "../../hooks/useGameSetting";
import { useGameCore } from "../../hooks/useGameCore";
import { ModalMenu } from "../../components/ModalMenu";
import { ModalGameOver } from "../../components/ModalGameOver";
import { TileGrid } from "../../components/TileGrid";
import { useWindowWidth } from "@react-hook/window-size";
import "./style.scss";

export const InGame: React.FC<{ setting: GameSetting }> = ({
  setting: { value: setting },
}) => {
  const windowWidth = useWindowWidth(); // how to mock this hook ???
  const [isMenuShowned, setShowMenu] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);

  const {
    isLoaded,
    tiles,
    isGameOver,
    remainPair,
    onSelectTile,
    restartGame: resetTiles,
  } = useGameCore(setting);
  const timer = useTimer();
  const history = useHistory();

  const remainPairRef = useRef<number>(remainPair);

  // change turn
  useEffect(() => {
    if (
      moveCount > 0 &&
      tiles.filter((tile) => tile.state === "selected").length === 0
    ) {
      if (remainPair === remainPairRef.current) {
        setTurn(turn + 1);
      } else {
        const newScore = [...scores];
        newScore[turn % setting.numberOfPlayers] += 1;
        setScores(newScore as [number, number, number, number]);
      }
      remainPairRef.current = remainPair;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  useEffect(() => {
    if (!isGameOver) timer.start();
    else timer.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

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
    setTurn(0);
    setScores([0, 0, 0, 0]);
  };

  const newGame = () => {
    history.push("/");
  };

  return (
    <>
      <div className="screen-container">
        <header>
          <span>memory</span>
          {windowWidth >= 760 ? ( // hum how to test ???
            <div>
              <button className="btn-restart" onClick={resetGame}>
                Restart
              </button>
              <button className="btn-new-game" onClick={newGame}>
                New Game
              </button>
            </div>
          ) : (
            <button className={`btn-menu`} onClick={showMenu}>
              menu
            </button>
          )}
        </header>
        <main>
          {isLoaded && (
            <TileGrid {...{ tiles, setting, onSelectTile: selectTile }} />
          )}
        </main>
        <footer
          className={`${setting.numberOfPlayers === 1 ? "solo" : "multi"}`}
        >
          {setting.numberOfPlayers === 1 && (
            <>
              <div role="timer" aria-label="time">
                <span>Time</span>
                <span>{timer.value}</span>
              </div>
              <div role="status" aria-label="moves">
                <span>Moves</span>
                <span>{moveCount}</span>
              </div>
            </>
          )}
          {setting.numberOfPlayers > 1 && (
            <>
              {Array(setting.numberOfPlayers)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    role="status"
                    className={`player-status ${
                      turn % setting.numberOfPlayers === idx
                        ? "player-active"
                        : ""
                    }`}
                    aria-label={`player ${idx + 1}`}
                  >
                    <span data-player={idx + 1}>{`Player ${idx + 1}`}</span>
                    <span>{scores[idx]}</span>
                  </div>
                ))}
            </>
          )}
        </footer>
      </div>
      {isMenuShowned && (
        <ModalMenu
          onClose={hideMenu}
          onResume={hideMenu}
          onNewGame={newGame}
          onRestart={resetGame}
        />
      )}
      {isGameOver && (
        <ModalGameOver
          numberOfPlayers={setting.numberOfPlayers}
          scores={scores}
          elapsedTime={timer.value}
          moveCount={moveCount}
          onNewGame={newGame}
          onRestart={resetGame}
        />
      )}
    </>
  );
};
