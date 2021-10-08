import { ModalContainer } from "../ModalContainer";
import "./styles.scss";

interface Props {
  elapsedTime?: string;
  moveCount?: number;
  onClose?: () => void;
  onRestart?: () => void;
  onNewGame?: () => void;
}

export const ModalSoloGameOver = ({
  elapsedTime,
  moveCount,
  onClose,
  onRestart,
  onNewGame,
}: Props) => (
  <ModalContainer onClose={() => onClose && onClose()}>
    <div className="game-over-container">
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
      <button onClick={() => onRestart && onRestart()}>Restart</button>
      <button onClick={() => onNewGame && onNewGame()}>Setup New Game</button>
    </div>
  </ModalContainer>
);
