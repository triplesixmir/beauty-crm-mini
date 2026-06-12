import {useEffect} from "react";
import closeIcon from "../../assets/general-icons/close-icon.svg";

export function Toast({ id, type, message, duration, removeToast }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, removeToast]);


  return (
    <div className={`toast toast-${type}`}>

      <button
        className="toast__close-button"
        type="button"
        aria-label="Закрыть"
        onClick={() => removeToast(id)}
      >
        <img
          src={closeIcon}
          alt=""
          aria-hidden="true"
        />
      </button>

      <h4>{message}</h4>

    </div>
  )
}