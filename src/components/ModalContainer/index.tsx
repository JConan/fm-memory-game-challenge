import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  children?: React.ReactNode;
}

export const ModalContainer = ({ onClose, children }: ModalProps) =>
  createPortal(
    <div className="modal-container" onClick={onClose}>
      {children}
    </div>,
    document.body
  );
