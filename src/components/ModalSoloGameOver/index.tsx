import { ModalContainer } from "components/ModalContainer";

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
    <h1>You did it!</h1>
    <h2>Game over! Here's how you got on...</h2>
    <label htmlFor="time">Time Elapsed</label>
    <input type="text" name="time" id="time" defaultValue={elapsedTime} />
    <label htmlFor="move">Moves Taken</label>
    <input
      type="text"
      name="move"
      id="move"
      defaultValue={`${moveCount} Moves`}
    />
    <button onClick={() => onRestart && onRestart()}>Restart</button>
    <button onClick={() => onNewGame && onNewGame()}>Setup New Game</button>
  </ModalContainer>
);
