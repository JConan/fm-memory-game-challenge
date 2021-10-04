import { ModalContainer } from "components/ModalContainer";
import "./style.scss";

interface MenuProps {
  onRestart?: () => void;
  onNewGame?: () => void;
  onResume?: () => void;
}

export const Menu = ({ onRestart, onNewGame, onResume }: MenuProps) => (
  <ModalContainer onClose={() => {}}>
    <button onClick={() => onRestart && onRestart()}>Restart</button>
    <button onClick={() => onNewGame && onNewGame()}>New Game</button>
    <button onClick={() => onResume && onResume()}>Resume Game</button>
  </ModalContainer>
);
