import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

const Toast = ({ isShown, message, type, onClose }) => {
  const isError = type === "error";

  useEffect(() => {
    if (!isShown) return undefined;
    const timeoutId = setTimeout(onClose, 3000);
    return () => clearTimeout(timeoutId);
  }, [isShown, onClose]);

  return (
    <div className={`toast ${isShown ? "toast--visible" : "toast--hidden"}`} role="status" aria-live="polite">
      <div className={`toast__content ${isError ? "toast__content--error" : "toast__content--success"}`}>
        <div className="toast__icon">{isError ? <FiAlertCircle aria-hidden="true" /> : <FiCheckCircle aria-hidden="true" />}</div>
        <p className="toast__message">{message}</p>
        <button className="toast__close" onClick={onClose} aria-label="Dismiss notification"><FiX aria-hidden="true" /></button>
        {isShown && <span className="toast__progress" />}
      </div>
    </div>
  );
};

export default Toast;
