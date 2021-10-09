import { createPortal } from "react-dom";
import "./style.scss";

interface ModalProps {
  onClose?: () => void;
  children?: React.ReactNode;
}

export const ModalContainer = ({ onClose, children }: ModalProps) =>
  createPortal(
    <div role="dialog" className="modal-container" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
