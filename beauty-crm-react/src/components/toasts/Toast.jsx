import {useEffect, useState} from "react";
import closeIcon from "../../assets/general-icons/close-icon.svg";

export function Toast({ id, type, message, duration, removeToast }) {

  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {

    const timerToLeaving = setTimeout(() => {
      setIsLeaving(true);
    }, duration);

    return () => {
      clearTimeout(timerToLeaving);
    };
  }, [duration]);

  useEffect(() => {

    if (!isLeaving) return;

    const timerToRemove = setTimeout(() => {
      removeToast(id);
    }, 250)

    return () => {
      clearTimeout(timerToRemove);
    };
  }, [id, isLeaving, removeToast]);


  return (
    <div className={`toast toast-${type} toast--leaving-${isLeaving}`}>

      <button
        className="toast__close-button"
        type="button"
        aria-label="Закрыть"
        onClick={() => setIsLeaving(true)}
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