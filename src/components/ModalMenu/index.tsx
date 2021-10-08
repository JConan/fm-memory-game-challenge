import { ModalContainer } from "../ModalContainer";
import "./style.scss";

interface ModalMenuProps {
  onRestart?: () => void;
  onNewGame?: () => void;
  onResume?: () => void;
  onClose: () => void;
}

export const ModalMenu = ({
  onRestart,
  onNewGame,
  onResume,
  onClose,
}: ModalMenuProps) => (
  <ModalContainer onClose={() => onClose()}>
    <div className="menu">
      <button onClick={() => onRestart && onRestart()}>Restart</button>
      <button onClick={() => onNewGame && onNewGame()}>New Game</button>
      <button onClick={() => onResume && onResume()}>Resume Game</button>
    </div>
  </ModalContainer>
);
