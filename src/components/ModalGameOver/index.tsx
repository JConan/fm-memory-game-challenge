import { ModalContainer } from "../ModalContainer";
import "./styles.scss";

interface Props {
  elapsedTime?: string;
  moveCount?: number;
  numberOfPlayers?: number;
  scores?: [number, number, number, number];
  onClose?: () => void;
  onRestart?: () => void;
  onNewGame?: () => void;
}

export const ModalGameOver = ({
  elapsedTime,
  moveCount,
  numberOfPlayers = 1,
  scores = [0, 0, 0, 0],
  onClose,
  onRestart,
  onNewGame,
}: Props) => {
  const sortedScore = scores
    .map((value, idx) => ({ player: idx + 1, value }))
    .sort((a, b) => b.value - a.value);

  const winners = sortedScore
    .filter((score) => score.value === sortedScore[0].value)
    .map(({ player }) => player);

  return (
    <ModalContainer onClose={() => onClose && onClose()}>
      <div
        className={
          numberOfPlayers > 1
            ? "game-over-container multi"
            : "game-over-container solo"
        }
      >
        {numberOfPlayers > 1 ? (
          <>
            <div>
              {winners.length > 1 ? (
                <h1>It's a tie!</h1>
              ) : (
                <h1>Player {sortedScore[0].player} Wins!</h1>
              )}

              <h2>Game over! Here are the results...</h2>
            </div>
            <div>
              {sortedScore.slice(0, numberOfPlayers).map((score) => (
                <div
                  key={score.player}
                  role="status"
                  aria-label={`score player ${score.player}`}
                  className={
                    winners.includes(score.player)
                      ? "score-container winner"
                      : "score-container"
                  }
                >
                  <label htmlFor={`score player ${score.player}`}>
                    Player {score.player}
                    {winners.includes(score.player) && " (Winner!)"}
                  </label>
                  <input
                    type="text"
                    name={`score player ${score.player}`}
                    id={`score player ${score.player}`}
                    disabled={true}
                    defaultValue={`${score.value} Pairs`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <h1>You did it!</h1>
              <h2>Game over! Here's how you got on...</h2>
            </div>
            <div>
              <div className="score-container">
                <label htmlFor="time">Time Elapsed</label>
                <input
                  type="text"
                  name="time"
                  id="time"
                  disabled={true}
                  defaultValue={elapsedTime}
                />
              </div>
              <div className="score-container">
                <label htmlFor="move">Moves Taken</label>
                <input
                  type="text"
                  name="move"
                  id="move"
                  disabled={true}
                  defaultValue={`${moveCount} Moves`}
                />
              </div>
            </div>
          </>
        )}
        <div
          className={
            numberOfPlayers > 1
              ? "buttons-container multi"
              : "buttons-container solo"
          }
        >
          <button onClick={() => onRestart && onRestart()}>Restart</button>
          <button onClick={() => onNewGame && onNewGame()}>
            Setup New Game
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};
